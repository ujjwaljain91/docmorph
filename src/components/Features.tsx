import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Infinity, Shield, Zap, Users, Heart, Globe,
  CheckCircle, Star, Award, TrendingUp
} from "lucide-react";

const features = [
  {
    icon: Infinity,
    title: "100% Free Forever",
    description: "No subscriptions, no limits, no catches. All professional PDF tools completely free.",
    badge: "Forever Free",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Files processed locally when possible. No registration required for maximum privacy.",
    badge: "Secure",
    color: "from-green-500 to-green-600"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized processing engine delivers results in seconds, not minutes.",
    badge: "Instant",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: Users,
    title: "Community Powered",
    description: "Built by the community, for the community. Your feedback shapes our development.",
    badge: "Open",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description: "Access from any device, any browser. No downloads or installations required.",
    badge: "Universal",
    color: "from-cyan-500 to-blue-500"
  },
  {
    icon: Heart,
    title: "No Ads, No Tracking",
    description: "Clean, distraction-free interface focused purely on your productivity.",
    badge: "Clean",
    color: "from-pink-500 to-red-500"
  }
];

const stats = [
  { number: "2M+", label: "Happy Users", icon: Users },
  { number: "50M+", label: "Files Processed", icon: TrendingUp },
  { number: "25+", label: "PDF Tools", icon: Award },
  { number: "99.9%", label: "Uptime", icon: Star }
];

export const Features = () => {
  return (
    <div className="py-20 px-6 bg-gradient-to-br from-muted/30 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 bg-gradient-primary text-white font-medium">
            Why Choose DocMorph
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Professional Tools,
            <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent"> Zero Cost</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We believe powerful PDF tools should be accessible to everyone. That's why DocMorph is 
            completely free with no limitations, forever.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="p-8 shadow-card hover:shadow-glow transition-all duration-300 group cursor-pointer border-2 border-transparent hover:border-primary/20 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative">
                <Badge 
                  className={`absolute -top-2 -right-2 bg-gradient-to-r ${feature.color} text-white font-medium`}
                >
                  {feature.badge}
                </Badge>
                
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats section */}
        <div className="bg-gradient-glass backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-elegant">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted Worldwide
            </h3>
            <p className="text-lg text-muted-foreground">
              Join millions who've discovered the power of free, professional PDF tools
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex p-3 rounded-xl bg-gradient-primary text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission statement */}
        <div className="mt-20 text-center max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-success" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Our Promise to You
          </h3>
          <p className="text-lg text-muted-foreground leading-relaxed">
            DocMorph will always be completely free. No subscriptions, no premium tiers, 
            no artificial limitations. We're building the PDF toolkit that we wish existed - 
            powerful, fast, and accessible to everyone.
          </p>
        </div>
      </div>
    </div>
  );
};