interface ChartContainerProps {
  children: React.ReactNode;
}

export default function ChartContainer({ children }: ChartContainerProps) {
  return (
    <div className="col-span-1 min-w-0">
      <div className="bg-white rounded-lg shadow-lg min-h-[400px] lg:min-h-[500px]">
        {children}
      </div>
    </div>
  );
}
