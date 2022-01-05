import './App.css';
import Theme from './lib/theme';
import Title from './components/title';
import Conversation from './components/conversation';

function App() {
  return (
    <Theme>
      <div id="App" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div>
          <Title/>
          <Conversation id={1}/>
        </div>
      </div>
    </Theme>
  );
}

export default App;
