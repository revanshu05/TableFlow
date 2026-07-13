import {BrowserRouter, Routes, Route, Link} from "react-router-dom"
import {Home, Auth, Orders, Tables, Menu} from "./pages"
import Header from "./components/shared/Header"
import Footer from "./components/shared/Footer"

function App() {

  return (
    <>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/auth" element={<Auth/>} />
          <Route path="/orders" element={<Orders/>} />
          <Route path="/tables" element={<Tables/>} />
          <Route path="/menu" element={<Menu/>} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App
