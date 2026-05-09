import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  const handleComingSoon = (featureName) => {
    Alert.alert(
      "Coming Soon",
      `${featureName} will be available in a future update.`,
    );
  };

  const handleLogout = async () => {
    await logout();
    // After clearing user data, send the user back to the Login screen
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {user?.firstName}!</Text>
      <Text style={styles.subtitle}>What would you like to do?</Text>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleComingSoon("Pack Order")}
        >
          <Text style={styles.cardText}>Pack Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleComingSoon("Stock Lookup")}
        >
          <Text style={styles.cardText}>Stock Lookup</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleComingSoon("Stocktake")}
        >
          <Text style={styles.cardText}>Stocktake</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleComingSoon("Add Product")}
        >
          <Text style={styles.cardText}>Add Product</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleComingSoon("Add Order")}
        >
          <Text style={styles.cardText}>Add Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleComingSoon("Orders")}
        >
          <Text style={styles.cardText}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleComingSoon("Products")}
        >
          <Text style={styles.cardText}>Products</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  welcome: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    paddingVertical: 25,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "500",
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
  },
  profileBtn: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  logoutBtn: {
    backgroundColor: "#dc3545",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});