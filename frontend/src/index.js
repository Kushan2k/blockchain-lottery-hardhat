import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { MoralisProvider } from "react-moralis"
import "bootstrap/dist/css/bootstrap.css"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <MoralisProvider
      initializeOnMount={false}
      appId={"d2050fb8-afb9-4c6d-9efb-e0db4abce7f5"}
    >
      <App />
    </MoralisProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
