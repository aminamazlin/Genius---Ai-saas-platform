"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card"

const testimonials = [
  {
    name: "Sophia",
    avatar: "S",
    title: "Software Engineer",
    description:
      "This application has transformed the way I work! The features are intuitive and powerful.",
  },
  {
    name: "Antoine",
    avatar: "A",
    title: "Product Manager",
    description:
      "I can't believe how much easier my team’s workflow has become. Highly recommend it!",
  },
  {
    name: "Liam",
    avatar: "L",
    title: "UX Designer",
    description:
      "A fantastic tool that helps me create and collaborate effortlessly. It's a game changer!",
  },
  {
    name: "Emma",
    avatar: "E",
    title: "Data Scientist",
    description:
      "This application is incredibly user-friendly and efficient. It saves me hours every week!",
  },
];

const LandingContent = () => {
  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">
        Testimonials
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map((item) => (
          <Card
            key={item.description}
            className="bg-[#192339] border-none text-white"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div>
                  <p className="text-lg">{item.name}</p>
                  <p className="text-zinc-400 text-sm">{item.title}</p>
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0">
                {item.description} 
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default LandingContent