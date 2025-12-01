export type Profile = {
    id: string; // uuid型はTypeScriptではstringで扱う
    username: string;
    email: string;
    full_name: string | null; // NULLを許容するカラムは | null をつける
  };