import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Mail, Phone, User, BookOpen } from 'lucide-react';

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

interface AttendanceTableProps {
  students: StudentRecord[];
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({ students }) => {
  if (students.length === 0) {
    return (
      <Card className="p-8 text-center bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <BookOpen className="h-12 w-12 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-medium text-foreground">No students found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="border rounded-lg bg-card shadow-soft">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Student Info</TableHead>
            <TableHead className="font-semibold">Contact Details</TableHead>
            <TableHead className="font-semibold">Course</TableHead>
            <TableHead className="font-semibold">Reference</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, index) => (
            <TableRow key={`${student['client refexternal']}-${index}`} className="hover:bg-muted/30 transition-colors">
              <TableCell className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">
                      {student['client first name']} {student['client last name']}
                    </p>
                  </div>
                </div>
              </TableCell>
              
              <TableCell className="space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span className="text-foreground">{student['client email']}</span>
                  </div>
                  {student['client alternative email'] && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{student['client alternative email']}</span>
                    </div>
                  )}
                  {student['client mobile'] && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{student['client mobile']}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium text-foreground text-sm">
                    {student['course offer desc']}
                  </p>
                  <Badge variant="outline" className="text-xs bg-accent-soft">
                    {student['unit desc']}
                  </Badge>
                </div>
              </TableCell>
              
              <TableCell>
                <Badge variant="secondary" className="font-mono text-xs">
                  {student['client refexternal']}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};