import type { ReactNode } from "react";

interface CardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const Card = ({ icon, title, description }: CardProps) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 text-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
      <div className="text-blue-400 mb-4 flex justify-center">{icon}</div>
      <h3 className="text-lg font-bold text-slate-50 mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
};

export default Card;
