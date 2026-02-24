export function GameLog({ logs }: { logs: string[] }) { return <div className="panel"><h4>Log</h4>{logs.map((l,i)=><div key={i}>{l}</div>)}</div>; }
