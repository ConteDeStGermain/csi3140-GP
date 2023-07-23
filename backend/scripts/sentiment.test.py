import unittest
import subprocess

class TestSum(unittest.TestCase):

    def test_sentiment_with_no_message(self):
        sp = subprocess.run(["python", "sentiment.py"], capture_output=True) 
        self.assertEqual( sp.returncode, 1 )
        self.assertTrue( "IndexError" in sp.stderr.decode() )

    def test_sentiment_with_message(self):
        sp = subprocess.run(["python", "sentiment.py", "sample message"], capture_output=True) 
        self.assertEqual( sp.returncode, 0 )
        output = sp.stdout.decode()
        self.assertTrue( len(output) > 1 )
        self.assertTrue( len(output.split(" ")) == 2 )
        self.assertTrue( output.split(" ")[0].isnumeric() )
        self.assertTrue( float(output.split(" ")[1]) )

if __name__ == '__main__':
    unittest.main()