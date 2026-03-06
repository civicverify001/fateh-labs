export interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  created_at: string;
}

export interface Project {
  id: number;
  challenge_id: number;
  kid_name: string;
  title: string;
  url: string;
  votes: number;
  created_at: string;
}
