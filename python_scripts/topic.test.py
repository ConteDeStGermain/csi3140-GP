import unittest
import subprocess

class TestSum(unittest.TestCase):

    def test_topic_with_missing_parameters(self):
        sp = subprocess.run(["python", "topic.py"], capture_output=True) 
        self.assertEqual( sp.returncode, 1 )
        self.assertTrue( "IndexError" in sp.stderr.decode() )

    def test_topic_with_present_parameters_but_empty_file(self):
        sp = subprocess.run(["python", "topic.py", "./test_files/topic_test_empty_sample.json", "2"], capture_output=True) 
        self.assertEqual( sp.returncode, 0 )
        output = sp.stdout.decode()
        self.assertTrue( len(output) == 0 )

        with open("./test_files/topic_test_empty_sample.json", "r") as f:
            self.assertTrue('"topic":' not in f.read())

    def test_topic_with_present_parameters(self):
        sp = subprocess.run(["python", "topic.py", "./test_files/topic_test_sample.json", "2"], capture_output=True) 
        self.assertEqual( sp.returncode, 0 )
        output = sp.stdout.decode()
        self.assertTrue( len(output) == 0 )
        
        with open("./test_files/topic_test_sample.json", "r") as f:
            self.assertTrue('"topic":'in f.read())

if __name__ == '__main__':
    unittest.main()