import Comment from './components/comment';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <Comment name="on9" id={1} op={true} sex={true}>Hi</Comment>
    </div>
  );
}

export default App;
