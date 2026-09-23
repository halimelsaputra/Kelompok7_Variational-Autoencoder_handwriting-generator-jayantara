import { Suspense } from "react"
import "./App.css"
import HomePage from "./page"
import { LenisProvider } from "@/components/lenis-provider"

function App() {
  return (
    <div className="dark">
      <LenisProvider>
        <Suspense fallback={null}>
          <HomePage />
        </Suspense>
      </LenisProvider>
    </div>
  )
}

export default App
