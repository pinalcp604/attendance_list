import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, FileSpreadsheet, Users, ArrowRight, CheckCircle, Clock, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-purple-600"
          style={{
            background: 'var(--gradient-hero)'
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
              Generate attendance lists from enrollment data
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-hero text-lg px-8 py-6">
                <Link to="/attendance" className="flex items-center gap-2">
                  Get Started <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
             
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in border-border">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary-soft flex items-center justify-center mb-4">
                  <FileSpreadsheet className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Excel Integration</CardTitle>
                <CardDescription>
                  Upload enrollment data directly from Excel files and process multiple subjects simultaneously.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in border-border" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent-soft flex items-center justify-center mb-4">
                  <CalendarDays className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Automated Sheets</CardTitle>
                <CardDescription>
                  Generate separate attendance sheets for each subject with pre-populated student information.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in border-border" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-success-soft flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-success" />
                </div>
                <CardTitle className="text-xl">Student Search</CardTitle>
                <CardDescription>
                  Quick search functionality to find students by name or reference across all enrollment data.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in border-border" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-warning-soft flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-warning" />
                </div>
                <CardTitle className="text-xl">Instant Processing</CardTitle>
                <CardDescription>
                  Process large enrollment files instantly and get organized attendance sheets in seconds.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in border-border" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary-soft flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Time Saving</CardTitle>
                <CardDescription>
                  Reduce manual work from hours to minutes with automated attendance list generation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in border-border" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent-soft flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Data Organization</CardTitle>
                <CardDescription>
                  Keep your student data organized with clear subject categorization and easy navigation.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="max-w-4xl mx-auto shadow-medium border-primary/20">
              <CardContent className="p-12">
                
                <Button asChild size="lg" className="shadow-soft text-lg px-8 py-6">
                  <Link to="/attendance" className="flex items-center gap-2">
                    Start Creating Attendance Lists <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;