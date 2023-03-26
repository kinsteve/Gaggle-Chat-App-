import {Routes , Route} from "react-router-dom";
import './App.css';
import HomePage from "./pages/Homepage";
import ChatPage from "./pages/ChatPage"

function App() {
  return (
    <div className="App">
       <Routes>
       <Route path="/" element={<HomePage/>}/>
       <Route path="/chats" element={<ChatPage/>}/>
       </Routes>
    </div>
  );
}

export default App;
