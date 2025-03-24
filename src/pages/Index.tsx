import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, BarChart2, Target, ArrowRight, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarDemo } from '@/components/SidebarDemo';

const Index = () => {
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error("Navigation failed:", error);
      window.location.href = path;
    }
  };
  
  return (
    <div className="min-h-screen bg-fitness-lightgray overflow-hidden">
      {/* Hero Section - Refreshed */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="fitness-container text-center max-w-4xl animate-fade-in">
          <span className="badge-pill bg-fitness-accent/10 text-fitness-accent mb-4 inline-block px-4 py-1 rounded-full text-sm font-medium">
            Track. Progress. Achieve.
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Your Personalized <br />
            <span className="text-fitness-accent bg-gradient-to-r from-fitness-accent to-fitness-mint bg-clip-text text-transparent">
              Fitness Journey
            </span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Track workouts, visualize progress, and achieve your fitness goals with our elegantly designed platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              className="bg-fitness-black text-white hover:bg-fitness-black/90 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              onClick={() => handleNavigation('/dashboard')}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              className="border-fitness-black text-fitness-black hover:bg-fitness-black/5 px-8 py-6 text-lg rounded-xl"
              onClick={() => handleNavigation('/workouts')}
            >
              View Workouts
            </Button>
          </div>
        </div>
        
        {/* Background elements */}
        <div className="absolute top-40 left-20 w-64 h-64 bg-fitness-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-fitness-mint/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
      </section>
      
      {/* Stats Section - New */}
      <section className="py-12 bg-white">
        <div className="fitness-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 rounded-xl bg-fitness-lightgray/50 text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-fitness-accent/10 mb-4">
                <Dumbbell className="h-8 w-8 text-fitness-accent" />
              </div>
              <span className="text-3xl font-bold mb-1">1200+</span>
              <p className="text-muted-foreground">Workouts Logged</p>
            </div>
            
            <div className="flex flex-col items-center p-6 rounded-xl bg-fitness-lightgray/50 text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-fitness-mint/10 mb-4">
                <Users className="h-8 w-8 text-fitness-mint" />
              </div>
              <span className="text-3xl font-bold mb-1">8,500+</span>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            
            <div className="flex flex-col items-center p-6 rounded-xl bg-fitness-lightgray/50 text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-50 mb-4">
                <Award className="h-8 w-8 text-blue-500" />
              </div>
              <span className="text-3xl font-bold mb-1">95%</span>
              <p className="text-muted-foreground">Goal Completion Rate</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="fitness-container">
          <div className="text-center mb-16 animate-slide-up">
            <span className="badge-pill bg-secondary text-secondary-foreground mb-4 inline-block px-4 py-1 rounded-full text-sm font-medium">
              Key Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools you need to track your fitness journey and achieve your goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-6 rounded-2xl animate-slide-up hover:shadow-lg transition-all" style={{ animationDelay: '100ms' }}>
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-fitness-accent/10 mb-4">
                <Dumbbell className="h-6 w-6 text-fitness-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Workout Logging</h3>
              <p className="text-muted-foreground">
                Record exercises, sets, reps, and weight with an intuitive interface designed for quick entries.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="glass-card p-6 rounded-2xl animate-slide-up hover:shadow-lg transition-all" style={{ animationDelay: '200ms' }}>
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-fitness-mint/10 mb-4">
                <BarChart2 className="h-6 w-6 text-fitness-mint" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Visualize your improvements with beautiful charts and comprehensive analytics.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="glass-card p-6 rounded-2xl animate-slide-up hover:shadow-lg transition-all" style={{ animationDelay: '300ms' }}>
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 mb-4">
                <Target className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Goal Setting</h3>
              <p className="text-muted-foreground">
                Set personalized goals and track your progress toward achieving them with milestone tracking.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Sidebar Demo Section */}
      <section className="py-24 bg-fitness-lightgray">
        <div className="fitness-container">
          <div className="text-center mb-16 animate-slide-up">
            <span className="badge-pill bg-fitness-accent/10 text-fitness-accent mb-4 inline-block px-4 py-1 rounded-full text-sm font-medium">
              New Feature
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Animated Sidebar Navigation
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Experience our new animated sidebar for seamless navigation through the app.
            </p>
          </div>
          
          <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-xl">
            <SidebarDemo />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-fitness-black text-white">
        <div className="fitness-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-slide-up">
            Ready to transform your fitness journey?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-lg animate-slide-up" style={{ animationDelay: '100ms' }}>
            Join thousands of users who have already taken control of their fitness with our platform.
          </p>
          <Button 
            className="bg-white text-fitness-black hover:bg-gray-100 px-8 py-6 text-lg rounded-xl shadow-lg animate-slide-up"
            style={{ animationDelay: '200ms' }}
            onClick={() => handleNavigation('/dashboard')}
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
