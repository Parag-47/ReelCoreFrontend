import { AppRouter } from './router';
import { ThemeProvider } from '@/components/ThemeProvider';

export function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
