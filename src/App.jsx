import TranslatorBox from './components/TranslatorBox';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Language Translator
        </h1>
        <TranslatorBox />
      </div>
    </div>
  );
}

export default App;