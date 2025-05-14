
import { Check } from "lucide-react";

const features = [
  {
    title: "Fast & Modern",
    description: "Built with React, TypeScript and Vite for maximum performance and developer experience.",
  },
  {
    title: "Responsive Design",
    description: "Works beautifully on all devices, from mobile phones to desktop screens.",
  },
  {
    title: "Customizable",
    description: "Easily customize every aspect of this template to match your brand and needs.",
  },
  {
    title: "Well Documented",
    description: "Clear documentation and code comments make it easy to understand and modify.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to start your next web project on the right foot.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
