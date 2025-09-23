"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  GraduationCap,
  Users,
  TrendingUp,
  Calendar,
  Bell,
  Settings,
  LogOut,
  MessageCircle,
  BookOpen,
  Target,
  Clock,
  User,
  Plus,
  ArrowRight,
  BarChart3,
  FileText,
  Search,
} from "lucide-react"

export default function CounselorDashboard() {
  // Mock data - in real app this would come from API
  const counselorData = {
    name: "Ms. Rodriguez",
    email: "m.rodriguez@school.edu",
    totalStudents: 45,
    activeStudents: 38,
    completedSessions: 156,
    upcomingAppointments: 8,
    students: [
      {
        id: 1,
        name: "Alex Johnson",
        grade: "Class 12",
        progress: 65,
        lastSession: "2024-01-20",
        nextAppointment: "2024-01-25",
        status: "on-track",
        goals: 3,
      },
      {
        id: 2,
        name: "Emma Davis",
        grade: "Class 11",
        progress: 45,
        lastSession: "2024-01-18",
        nextAppointment: "2024-01-26",
        status: "needs-attention",
        goals: 2,
      },
      {
        id: 3,
        name: "Michael Chen",
        grade: "Class 12",
        progress: 85,
        lastSession: "2024-01-22",
        nextAppointment: "2024-01-28",
        status: "excellent",
        goals: 4,
      },
    ],
    todaySchedule: [
      { id: 1, time: "9:00 AM", student: "Alex Johnson", type: "Career Planning", duration: "45 min" },
      { id: 2, time: "11:00 AM", student: "Emma Davis", type: "College Prep", duration: "30 min" },
      {
        id: 3,
        time: "2:00 PM",
        student: "Parent Meeting - Johnson Family",
        type: "Progress Review",
        duration: "60 min",
      },
      { id: 4, time: "3:30 PM", student: "Michael Chen", type: "Application Review", duration: "45 min" },
    ],
    recentActivities: [
      { id: 1, action: "Completed session with Alex Johnson", time: "2 hours ago", type: "session" },
      { id: 2, action: "Updated Emma Davis's career plan", time: "1 day ago", type: "update" },
      { id: 3, action: "Sent progress report to parents", time: "2 days ago", type: "report" },
    ],
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800"
      case "on-track":
        return "bg-blue-100 text-blue-800"
      case "needs-attention":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-primary font-[var(--font-playfair)]">Career Advisor</h1>
              </div>
              <Badge variant="secondary" className="ml-4">
                Counselor
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold font-[var(--font-playfair)] mb-2">Welcome, {counselorData.name}!</h2>
          <p className="text-muted-foreground">
            Manage your student portfolio and guide them towards successful careers.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{counselorData.totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                  <p className="text-2xl font-bold">{counselorData.activeStudents}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed Sessions</p>
                  <p className="text-2xl font-bold">{counselorData.completedSessions}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming Appointments</p>
                  <p className="text-2xl font-bold">{counselorData.upcomingAppointments}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Today's Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Today's Schedule
                  </CardTitle>
                  <CardDescription>Your appointments for today</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {counselorData.todaySchedule.map((appointment) => (
                    <div key={appointment.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{appointment.student}</h4>
                          <span className="text-sm text-muted-foreground">{appointment.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {appointment.type} • {appointment.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest actions and updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {counselorData.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        {activity.type === "session" && <MessageCircle className="h-4 w-4 text-secondary" />}
                        {activity.type === "update" && <FileText className="h-4 w-4 text-accent" />}
                        {activity.type === "report" && <BarChart3 className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                    <Plus className="h-6 w-6" />
                    <span>Add Student</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                    <Calendar className="h-6 w-6" />
                    <span>Schedule Meeting</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                    <BarChart3 className="h-6 w-6" />
                    <span>Generate Report</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                    <MessageCircle className="h-6 w-6" />
                    <span>Send Message</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold font-[var(--font-playfair)]">Student Portfolio</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {counselorData.students.map((student) => (
                <Card key={student.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold">{student.name}</h4>
                          <p className="text-sm text-muted-foreground">{student.grade}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(student.status)}>{student.status.replace("-", " ")}</Badge>
                        <Button variant="outline" size="sm">
                          View Profile
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Progress</p>
                        <div className="flex items-center gap-2">
                          <Progress value={student.progress} className="flex-1" />
                          <span className="text-sm font-medium">{student.progress}%</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Active Goals</p>
                        <p className="text-lg font-bold text-secondary">{student.goals}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Last Session</p>
                        <p className="text-sm">{new Date(student.lastSession).toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Next Appointment</p>
                        <p className="text-sm">{new Date(student.nextAppointment).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold font-[var(--font-playfair)]">Schedule Management</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
                <CardDescription>Manage your appointments and availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {counselorData.todaySchedule.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="font-medium">{appointment.time}</p>
                          <p className="text-sm text-muted-foreground">{appointment.duration}</p>
                        </div>
                        <div>
                          <p className="font-medium">{appointment.student}</p>
                          <p className="text-sm text-muted-foreground">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold font-[var(--font-playfair)] mb-2">Reports & Analytics</h3>
              <p className="text-muted-foreground">Generate insights and track student progress</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Student Progress Overview
                  </CardTitle>
                  <CardDescription>Summary of all student progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 rounded-lg bg-green-50">
                        <div className="text-2xl font-bold text-green-600">12</div>
                        <p className="text-sm text-muted-foreground">Excellent</p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50">
                        <div className="text-2xl font-bold text-blue-600">20</div>
                        <p className="text-sm text-muted-foreground">On Track</p>
                      </div>
                      <div className="p-3 rounded-lg bg-yellow-50">
                        <div className="text-2xl font-bold text-yellow-600">6</div>
                        <p className="text-sm text-muted-foreground">Needs Attention</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Detailed Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Reports</CardTitle>
                  <CardDescription>Generate common reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <FileText className="h-4 w-4 mr-2" />
                      Monthly Progress Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Student Performance Analytics
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Users className="h-4 w-4 mr-2" />
                      Parent Communication Summary
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Target className="h-4 w-4 mr-2" />
                      Goal Achievement Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold font-[var(--font-playfair)] mb-2">Counseling Tools</h3>
              <p className="text-muted-foreground">Resources and tools to help guide your students</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Career Assessments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Access various career assessment tools for your students
                  </p>
                  <Button variant="outline" className="w-full bg-transparent">
                    Launch Assessment
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Goal Setting Templates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Pre-built templates for student goal setting sessions
                  </p>
                  <Button variant="outline" className="w-full bg-transparent">
                    View Templates
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Communication Hub
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Manage communications with students and parents</p>
                  <Button variant="outline" className="w-full bg-transparent">
                    Open Messages
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
