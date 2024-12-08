export type Question = {
  id: string;
  text: string;
};

export type Quiz = {
  id: string;
  name: string;
  questions: Question[];
  type: "General Purpose" | "Contributor";
};
