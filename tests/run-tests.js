import { run as runNormalize } from './test_normalizeReviews.js';

(async () => {
  try {
    await runNormalize();
    console.log('\n✅ All tests completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Test failure:', err);
    process.exit(1);
  }
})();
