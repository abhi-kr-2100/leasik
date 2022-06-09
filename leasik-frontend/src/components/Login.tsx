export interface ILoginProps {
  setUsername: (u: string) => void;
  setPassword: (p: string) => void;
  onLogin: () => void;
}

export default function Login(props: ILoginProps) {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-[50vw] px-[20%] py-[8%] rounded bg-emerald-400 flex flex-col gap-y-5 justify-center">
        <input
          placeholder="Username"
          className="p-3 rounded"
          onChange={(e) => props.setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-3 rounded"
          onChange={(e) => props.setPassword(e.target.value)}
        />
        <button className="bg-yellow-400 p-3 rounded" onClick={props.onLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
