// This is a utility script to create audio files from base64 data
// It's meant to be run once to generate the audio files

const fs = require('fs');
const path = require('path');

// Base64-encoded WAV files
const soundFiles = {
  // Simple beep sound for 10-second warning
  'beep.wav': 'UklGRqQFAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YYAFAACBgIF/gn6AfXx+fYGAf359fHx9f4CBg4GDg4SChYaGh4aGhoaEhYKEgYGCgYGAfX18e3p5eXh5eXp8fHx9f4KBhYWHiYeJh4mHiImHiIeGhIOCgH9+fXx7enp7e3p6e3p7fHx9f3+Bg4OEhYWGhoaHh4iIiImIiIaGhYWDgYF/f319fHt7e3t7fHx9fn5/gIGChIWFhoaHiImJioqLi4uKioqJiIeGhYOCgX9/fn18e3t7e3t7e3x9fn+AgYKDhIWGh4iIiYmKioqKioqJiYiHhoWEg4KBgH9+fXx8e3t7e3t8fH19fn+AgYKDhIWGhoaHiIiJiYmJiomJiIiHhoWEg4KBgH9/fn59fX18fHx8fH19fX5/f4CBgoODhIWFhoaHh4eIiIiIiIiHh4aFhYSEg4KCgYCAfn59fXx8fHx8fH19fX5+f4CBgoKDhISFhYaGhoaHh4iIiIiIh4eHhoaFhYSEg4KCgYGAf39+fn19fX19fX19fn5/f4CAgYGCg4ODhISFhYWGhoaGhoaGhoaFhYWEhISDg4OCgoGBgICAfn5+fX19fX19fX5+fn9/gICBgYKCg4ODhISEhYWFhYWFhYWFhYSEhISDg4OCgoKBgYGAgH9/fn5+fn5+fn5+fn5/f3+AgICBgYGCgoKDg4OEhISEhISEhISEhIODg4OCgoKCgYGBgYCAgH9/f39+fn5+fn5+f39/f4CAgICBgYGCgoKCg4ODg4ODg4ODg4ODg4OCgoKCgoGBgYGBgICAgH9/f39/f39/f39/f39/gICAgICBgYGBgoKCgoKCg4ODg4ODg4ODg4KCgoKCgoGBgYGBgYCAgICAgH9/f39/f39/f39/f4CAgICAgYGBgYGBgoKCgoKCgoKCgoKCgoKCgoKBgYGBgYGBgYCAgICAgICAgH9/f39/f39/f39/gICAgICAgICBgYGBgYGBgYKCgoKCgoKCgoKCgoGBgYGBgYGBgYCAgICAgICAgICAgH9/f39/f39/f3+AgICAgICAgICAgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYCAgICAgICAgICAgICAgICAgH+AgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==',

  // Countdown ticking sound (for 5 seconds remaining)
  'tick.wav': 'UklGRpYDAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YXIDAADIyMi3t7e3t7fIyNjY6Oj4+P///////////+jo2NjIyLe3t7e3t8jI2Njo6Pj4////////////6OjY2MjIt7e3t7e3yMjY2Ojo+Pj///////////8A6OjY2MjIt7e3t7e3yMjY2Ojo+Pj/////////////6OjY2MjIt7e3t7e3yMjY2Ojo+Pj///////////8A6OjY2MjIt7e3t7e3yMjY2Ojo+Pj/////////////6OjY2MjIt7e3t7e3yMjY2Ojo+Pj///////////8A6OjY2MjIt7e3t7e3yMjY2Ojo+Pj/////////////6OjY2MjIt7e3t7e3yMjY2Ojo+Pj///////////8A6OjY2MjIt7e3t7e3yMjY2Ojo+Pj/////////////6OjY2MjIt7e3t7e3yMjY2Ojo+Pj///////////8A6OjY2MjIt7e3t7e3yMjY2Ojo+Pj/////////////6OjY2MjIt7e3t7e3yMjY2Ojo+Pj///////////8A6OjY2MjIt7e3t7e3yMjY2Ojo+Pj/////////////6OjY2MjIt7e3t7e3yMjY2Ojo+Pj///////////8A6OjY2MjIt7e3t7e3yMjY2Ojo+Pj/////////////6OjY2MjIt7e3t7e3yMjY2Ojo+Pj///////////8A6OjY2MjIt7e3t7e3yMjY2Ojo+Pj/////////////6OjY2MjIt7e3t7e3yMjY2Ojo+Pj///////////8A6OjY2MjIt7e3t7e3yMjY2Ojo+Pj/////////////6OjY2MjIt7e3t7e3yMjY2Ojo+Pj///////////8A6OjY2MjIt7e3t7e3yMjY2Ojo+Pj/////////////6OjY2MjIt7e3t7e3yMjY2Ojo+Pj///////////8A6OjY2MjIt7e3t7e3yMjY2Ojo+Pj/////////////6OjY2MjIt7e3t7e3yMjY2Ojo+Pj///////////8A6OjY2MjIt7e3t7e3yMjY2Ojo+Pj/////////////6OjY2MjIt7e3t7e3yMjY2Ojo+Pj///////////8A6OjY2MjIt7e3t7e3yMjY2Ojo+Pj/////////////6OjY2MjIt7e3t7e3yMjY2Ojo+Pj///////////8A6OjY2MjIt7e3t7e3yMjY2Ojo+Pj/////////////6OjY2MjIt7e3t7e3yMjY2Ojo+Pj///////////8A6OjY2MjIt7e3t7e3yMjY2Ojo+Pj/////////////6OjY2A==',

  // Alarm sound (for time's up)
  'alarm.wav': 'UklGRiQHAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAHAADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6Oj/////AAAAAP///+jo6P///wD/AAAAAP//AADo6A=='
};

// Function to decode base64 to binary
function decodeBase64(base64) {
  return Buffer.from(base64, 'base64');
}

// Create the sounds directory if it doesn't exist
const soundsDir = path.join(__dirname, '../public/sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
  console.log('Created sounds directory');
}

// Write each sound file
Object.entries(soundFiles).forEach(([filename, base64Data]) => {
  const filePath = path.join(soundsDir, filename);
  const binaryData = decodeBase64(base64Data);

  fs.writeFileSync(filePath, binaryData);
  console.log(`Created ${filename}`);
});

console.log('Sound files created successfully!');
