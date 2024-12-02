import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';

// Settings Component
const Settings = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevState) => !prevState);
  };

  return (
    <View style={isDarkMode ? styles.darkContainer : styles.container}>

      {/* Theme Toggle */}
      <View style={styles.settingItem}>
        <Text style={isDarkMode ? styles.darkSettingText : styles.settingText}>
          Dark Mode
        </Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          thumbColor={isDarkMode ? '#6200ea' : '#f4f3f4'}
          trackColor={{ false: '#767577', true: '#6200ea' }}
        />
      </View>

    </View>
  );
};

// Styles for the Settings Component
const styles = StyleSheet.create({
  container: 
  {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  darkContainer: 
  {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#333', 
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  darkTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, .2)',
  },
  settingText: {
    fontSize: 18,
    color: '#333',
  },
  darkSettingText: {
    fontSize: 18,
    color: '#fff',
  },
  button: {
    backgroundColor: '#6200ea',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Settings;
