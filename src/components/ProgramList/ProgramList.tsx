import Item from './components/Item';

function ProgramList({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

ProgramList.Item = Item;
export default ProgramList;
