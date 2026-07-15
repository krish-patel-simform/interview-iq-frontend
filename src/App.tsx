import { Suspense } from "react";
import RoutesProvider from "./routes/RoutesProvider";

function App() {
  return (
    <Suspense fallback={null}>
      <RoutesProvider />
    </Suspense>
  );
}

export default App;
