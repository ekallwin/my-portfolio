import Navbar from "./Components/Navbar/navbar.jsx"
import Header from "./Components/Header/header.jsx"
import About from "./Components/About/about.jsx"
import Contact from "./Components/Contact/contact.jsx"
import Footer from "./Components/Footer/footer.jsx"
import ChatBot from "./Components/ChatBot/ChatBot.jsx"
function Home() {
    return (
        <>
            <Navbar />
            <Header />
            <About />
            <Contact />
            <ChatBot />
            <Footer />
        </>
    )
}
export default Home;