export interface ILoginProps {
  setUsername: (u: string) => void;
  setPassword: (p: string) => void;
  onLogin: () => void;
  onGuestLogin: () => void;
}

export default function Login(props: ILoginProps) {
  return (
    <div className="h-full bg-emerald-400 flex flex-col gap-y-3 justify-center items-center">
      <input
        placeholder="Username"
        className="p-3 rounded-sm"
        onChange={(e) => props.setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="p-3 rounded-sm"
        onChange={(e) => props.setPassword(e.target.value)}
      />
      <div className="flex gap-x-2">
        <button className="bg-yellow-400 p-3 rounded-sm" onClick={props.onLogin}>
          Login
        </button>
        <button className="bg-yellow-200 p-3 rounded-sm" onClick={props.onGuestLogin}>
          Guest Login
        </button>
      </div>
    </div>
  );
}
