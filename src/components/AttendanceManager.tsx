import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Users, FileSpreadsheet, Download, Search } from 'lucide-react';
import * as XLSX from 'xlsx';
import { AttendanceTable } from './AttendanceTable';

interface StudentRecord {
  'course offer desc': string;
  'client refexternal': string;
  'client first name': string;
  'client last name': string;
  'client email': string;
  'client alternative email': string;
  'client mobile': string;
  'unit desc': string;
}

export const AttendanceManager = () => {
  const [enrollmentData, setEnrollmentData] = useState<StudentRecord[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [filteredStudents, setFilteredStudents] = useState<StudentRecord[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [enrollmentSearchTerm, setEnrollmentSearchTerm] = useState<string>('');
  const [enrollmentSearchResults, setEnrollmentSearchResults] = useState<StudentRecord[]>([]);
  const { toast } = useToast();

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls)$/)) {
      toast({
        title: "Invalid file format",
        description: "Please upload an Excel file (.xlsx or .xls)",
        variant: "destructive",
      });
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as StudentRecord[];

        // Validate required columns with case-insensitive and trimmed matching
        const requiredColumns = ['unit desc', 'course offer desc', 'client refexternal', 
                                'client first name', 'client last name', 'client email'];
        
        if (jsonData.length > 0) {
          const firstRow = jsonData[0];
          const availableColumns = Object.keys(firstRow).map(col => col.toLowerCase().trim());
          
          console.log('Available columns:', availableColumns);
          console.log('Required columns:', requiredColumns);
          
          const missingColumns = requiredColumns.filter(col => 
            !availableColumns.includes(col.toLowerCase().trim())
          );
          
          if (missingColumns.length > 0) {
            toast({
              title: "Missing columns",
              description: `Missing: ${missingColumns.join(', ')}. Available: ${Object.keys(firstRow).join(', ')}`,
              variant: "destructive",
            });
            return;
          }
          
          // Normalize column names to handle case sensitivity and spaces
          const normalizedData = jsonData.map(row => {
            const normalizedRow: any = {};
            Object.keys(row).forEach(key => {
              const normalizedKey = key.toLowerCase().trim();
              const matchingRequiredCol = requiredColumns.find(req => 
                req.toLowerCase().trim() === normalizedKey
              );
              if (matchingRequiredCol) {
                normalizedRow[matchingRequiredCol] = row[key];
              } else {
                normalizedRow[key] = row[key]; // Keep original key for other columns
              }
            });
            return normalizedRow;
          });
          
          setEnrollmentData(normalizedData);
        
          // Extract unique subjects from "unit desc" column
          const uniqueSubjects = [...new Set(normalizedData.map(record => record['unit desc']))].filter(Boolean);
          setSubjects(uniqueSubjects);
          
          toast({
            title: "File uploaded successfully",
            description: `Loaded ${normalizedData.length} records with ${uniqueSubjects.length} subjects`,
          });
        }
      } catch (error) {
        toast({
          title: "Error reading file",
          description: "Please ensure the file is a valid Excel format",
          variant: "destructive",
        });
      }
    };

    reader.readAsArrayBuffer(file);
  }, [toast]);

  const handleSubjectSelect = useCallback((subject: string) => {
    setSelectedSubject(subject);
    const filtered = enrollmentData.filter(record => record['unit desc'] === subject);
    setFilteredStudents(filtered);
    setSearchTerm('');
  }, [enrollmentData]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    if (!selectedSubject) return;

    const baseFiltered = enrollmentData.filter(record => record['unit desc'] === selectedSubject);
    
    if (!term.trim()) {
      setFilteredStudents(baseFiltered);
      return;
    }

    const searchFiltered = baseFiltered.filter(student =>
      Object.values(student).some(value =>
        value?.toString().toLowerCase().includes(term.toLowerCase())
      )
    );
    
    setFilteredStudents(searchFiltered);
  }, [enrollmentData, selectedSubject]);

  const handleEnrollmentSearch = useCallback((term: string) => {
    setEnrollmentSearchTerm(term);
    
    if (!term.trim()) {
      setEnrollmentSearchResults([]);
      return;
    }

    const searchResults = enrollmentData.filter(student =>
      student['client first name']?.toString().toLowerCase().includes(term.toLowerCase()) ||
      student['client last name']?.toString().toLowerCase().includes(term.toLowerCase()) ||
      student['client refexternal']?.toString().toLowerCase().includes(term.toLowerCase())
    );
    
    setEnrollmentSearchResults(searchResults);
  }, [enrollmentData]);

  const exportAttendanceList = useCallback(() => {
    if (!filteredStudents.length) {
      toast({
        title: "No data to export",
        description: "Please select a subject first",
        variant: "destructive",
      });
      return;
    }

    const exportData = filteredStudents.map(student => ({
      'Course': student['course offer desc'],
      'Reference': student['client refexternal'],
      'First Name': student['client first name'],
      'Last Name': student['client last name'],
      'Email': student['client email'],
      'Alternative Email': student['client alternative email'] || '',
      'Mobile': student['client mobile'] || '',
      'Subject': student['unit desc'],
      'Present': '',
      'Absent': '',
      'Notes': ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance List');
    
    const fileName = `Attendance_${selectedSubject.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    toast({
      title: "Attendance list exported",
      description: `Downloaded ${fileName}`,
    });
  }, [filteredStudents, selectedSubject, toast]);

  const generateAllAttendanceLists = useCallback(() => {
    if (!enrollmentData.length || !subjects.length) {
      toast({
        title: "No data available",
        description: "Please upload an enrollment file first",
        variant: "destructive",
      });
      return;
    }

    const wb = XLSX.utils.book_new();

    subjects.forEach(subject => {
      const subjectStudents = enrollmentData.filter(record => record['unit desc'] === subject);
      
      const exportData = subjectStudents.map(student => ({
        'Course': student['course offer desc'],
        'Reference': student['client refexternal'],
        'First Name': student['client first name'],
        'Last Name': student['client last name'],
        'Email': student['client email'],
        'Alternative Email': student['client alternative email'] || '',
        'Mobile': student['client mobile'] || '',
        'Subject': student['unit desc'],
        'Present': '',
        'Absent': '',
        'Notes': ''
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const sheetName = subject.substring(0, 31).replace(/[^a-zA-Z0-9\s]/g, ''); // Excel sheet name limit
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    const fileName = `All_Attendance_Lists_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    toast({
      title: "All attendance lists generated",
      description: `Downloaded ${fileName} with ${subjects.length} sheets`,
    });
  }, [enrollmentData, subjects, toast]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Attendance Manager</h1>
          <p className="text-lg text-muted-foreground">Generate subject-wise attendance lists from enrollment data</p>
        </div>

        {/* Upload Section */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload Enrollment File
            </CardTitle>
            <CardDescription>
              Upload an Excel file containing enrollment data with student information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                  <Label htmlFor="file-upload" className="block text-sm font-medium mb-2">
                    Select Excel File
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                </div>
                {fileName && (
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-success" />
                    <Badge variant="outline" className="bg-success-soft text-success-foreground">
                      {fileName}
                    </Badge>
                  </div>
                )}
              </div>
              
              {subjects.length > 0 && (
                <div className="flex justify-center pt-2">
                  <Button onClick={generateAllAttendanceLists} className="gap-2" size="lg">
                    <FileSpreadsheet className="h-4 w-4" />
                    Generate Attendance List
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Check Student Enrollment */}
        {enrollmentData.length > 0 && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Check Student Enrollment
              </CardTitle>
              <CardDescription>
                Search for students by first name, last name, or reference
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="enrollment-search" className="block text-sm font-medium mb-2">
                    Search Students
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="enrollment-search"
                      type="text"
                      placeholder="Search by first name, last name, or reference..."
                      value={enrollmentSearchTerm}
                      onChange={(e) => handleEnrollmentSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                {enrollmentSearchResults.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Search Results</h4>
                      <Badge variant="secondary" className="bg-primary-soft">
                        {enrollmentSearchResults.length} found
                      </Badge>
                    </div>
                    <AttendanceTable students={enrollmentSearchResults} />
                  </div>
                )}
                
                {enrollmentSearchTerm && enrollmentSearchResults.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No students found matching "{enrollmentSearchTerm}"
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subject Selection */}
        {subjects.length > 0 && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Select Subject
              </CardTitle>
              <CardDescription>
                Choose a subject to view the attendance list
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="subject-select" className="block text-sm font-medium mb-2">
                    Available Subjects ({subjects.length})
                  </Label>
                  <Select value={selectedSubject} onValueChange={handleSubjectSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject..." />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedSubject && (
                  <div className="flex items-end">
                    <Button onClick={exportAttendanceList} className="gap-2">
                      <Download className="h-4 w-4" />
                      Export List
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Results */}
        {selectedSubject && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  Attendance List - {selectedSubject}
                </div>
                <Badge variant="secondary" className="bg-primary-soft">
                  {filteredStudents.length} students
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="search" className="block text-sm font-medium mb-2">
                  Search Students
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search by name, email, or reference..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <AttendanceTable students={filteredStudents} />
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {subjects.length === 0 && (
          <Card className="shadow-soft border-accent/20">
            <CardHeader>
              <CardTitle className="text-accent">Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>📋 <strong>Upload your enrollment Excel file</strong> - Make sure it contains the following columns:</p>
                <ul className="ml-4 space-y-1">
                  <li>• <code>unit desc</code> - Subject/Unit descriptions</li>
                  <li>• <code>course offer desc</code> - Course information</li>
                  <li>• <code>client refexternal</code> - Student reference</li>
                  <li>• <code>client first name</code> - Student first name</li>
                  <li>• <code>client last name</code> - Student last name</li>
                  <li>• <code>client email</code> - Primary email</li>
                  <li>• <code>client alternative email</code> - Secondary email</li>
                  <li>• <code>client mobile</code> - Mobile number</li>
                </ul>
                <p>🎯 <strong>Select a subject</strong> from the dropdown to filter students</p>
                <p>📊 <strong>Export attendance lists</strong> for printing or digital use</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};