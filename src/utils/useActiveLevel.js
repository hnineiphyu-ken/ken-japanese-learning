import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Hook to inspect and switch active JLPT Level based on Route Prefix Scoping (/n5/... vs /n4/...)
 */
export function useActiveLevel() {
  const location = useLocation();
  const navigate = useNavigate();

  const isN4 = location.pathname.startsWith('/n4');
  const level = isN4 ? 'n4' : 'n5';
  const levelUpper = isN4 ? 'N4' : 'N5';

  function switchLevel(targetLevel) {
    const target = targetLevel.toLowerCase();
    if (target === level) return;

    const currentPath = location.pathname;

    if (target === 'n4') {
      // Transitioning to N4
      if (currentPath.includes('/kotoba')) {
        navigate('/n4/kotoba');
      } else if (currentPath.includes('/quiz')) {
        navigate('/n4/quiz');
      } else {
        navigate('/n4/lessons');
      }
    } else {
      // Transitioning to N5
      if (currentPath.includes('/kotoba')) {
        navigate('/n5/kotoba');
      } else if (currentPath.includes('/quiz')) {
        navigate('/n5/quiz');
      } else if (currentPath.includes('/hiragana')) {
        navigate('/n5/hiragana');
      } else if (currentPath.includes('/katakana')) {
        navigate('/n5/katakana');
      } else if (currentPath.includes('/basics')) {
        navigate('/n5/basics');
      } else {
        navigate('/n5/lessons');
      }
    }
  }

  return {
    level,
    levelUpper,
    isN4,
    isN5: !isN4,
    switchLevel
  };
}
