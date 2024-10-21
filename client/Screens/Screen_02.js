import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Pressable, ScrollView, Text, TextInput, View, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";

const Tab = createBottomTabNavigator();

const Screen_02 = () => {
    const navigation = useNavigation();
    const [focus, setFocus] = useState("smart");
    const [selectedOption, setSelectedOption] = useState("Best Sales");
    const [product, setProduct] = useState([]);
    const [showAllProducts, setShowAllProducts] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [visible, setVisible] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [visibleCart, setVisibleCart] = useState(false);
    const [quantity, setQuantity] = useState(1); 
    // Tạo ref cho TextInput
    const searchInputRef = useRef(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:3000/products");
                setProduct(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProducts();
    }, []);

    const handleSearchChange = useCallback((text) => {
        setSearchKeyword(text);
    }, []);

    // Focus vào lại TextInput
    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchKeyword]);

    const CategoryItem = useCallback(
        ({ image, backgroundColor, type }) => {
            return (
                <Pressable
                    style={[styles.categoryItem, { backgroundColor, borderColor: focus === type ? "#a59ac6" : "transparent" }]}
                    onPress={() => {
                        setFocus(type);
                        setShowAllProducts(false);
                    }}
                >
                    <Image source={image} />
                </Pressable>
            );
        },
        [focus]
    );

    const OptionItem = useCallback(
        ({ title }) => {
            return (
                <TouchableOpacity
                    style={[styles.optionItem, { backgroundColor: selectedOption === title ? "#ebfdff" : "transparent" }]}
                    onPress={() => setSelectedOption(title)}
                >
                    <Text style={{ color: selectedOption === title ? "#42b7c6" : "black" }}>{title}</Text>
                </TouchableOpacity>
            );
        },
        [selectedOption]
    );

    const ProductItem = ({ item, isCart }) => (
        <View style={styles.productItem}>
            <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="contain" />
            <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{item.title}</Text>
                <Image source={require("../assets/Data/ratting.png")} />
            </View>
            <View style={styles.productPriceContainer}>
                {isCart ? (
                    // Hiển thị số lượng nếu là giỏ hàng
                    <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
                ) : (
                    <TouchableOpacity
                        onPress={() => {
                            setCurrentProduct(item); // Lưu trữ thông tin sản phẩm hiện tại
                            setVisible(true);
                        }}
                    >
                        <Image source={require("../assets/Data/plus.png")} style={styles.productPlusIcon} resizeMode="contain" />
                    </TouchableOpacity>
                )}
                <Text style={styles.productPrice}>{item.price}</Text>
            </View>
        </View>
    );
    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const priceWithoutDollar = item.price.replace('$', ''); // Xóa ký hiệu $
            const price = parseFloat(priceWithoutDollar); // Chuyển đổi thành số
            return total + price * item.quantity; // Tính tổng
        }, 0);
    };
    const filteredProducts = useMemo(() => {
        const selectedCategory = product.find((item) => item[focus]);
        if (!selectedCategory) return [];

        const productsToShow = showAllProducts ? selectedCategory[focus] : selectedCategory[focus].slice(0, 4);

        return productsToShow.filter((item) => item.title.toLowerCase().includes(searchKeyword.toLowerCase()));
    }, [product, focus, showAllProducts, searchKeyword]);

    const renderProducts = useCallback(
        () => filteredProducts.map((item) => <ProductItem key={item.id} item={item} />),
        [filteredProducts]
    );

    const renderCart = useMemo(() => cart.map((item) => <ProductItem key={item.id} item={item} isCart />), [cart]);

    const MainScreen = () => {
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <ScrollView>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                                <Text style={styles.backButtonText}>{"<"}</Text>
                                <Text style={styles.headerTitle}>Electronics</Text>
                            </TouchableOpacity>
                            <View style={styles.headerIcons}>
                                <TouchableOpacity onPress={() => setVisibleCart(true)}>
                                    <AntDesign name="shoppingcart" size={24} color="black" />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Image source={require("../assets/Data/avatar.png")} style={styles.avatar} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Modal cart */}
                        <Modal animationType="fade" transparent={true} visible={visibleCart} onRequestClose={() => setVisibleCart(false)}>
    <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cart</Text>
            <ScrollView style={{ width: "100%" }}>
                <View style={{ rowGap: 10 }}>{renderCart}</View>
            </ScrollView>
            <Text style={styles.totalPrice}>Total: ${calculateTotal().toFixed(2)}</Text>
            <View style={styles.modalButtonsContainer}>
            <TouchableOpacity style={[styles.modalButton, {backgroundColor: 'blue'}]} onPress={() => {alert("Thanh toán thành công"), setVisibleCart(false), setCart([])}}>
                    <Text style={styles.modalButtonText}>Payment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setVisibleCart(false)}>
                    <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
</Modal>


                        <View style={styles.searchContainer}>
                            <Pressable style={styles.searchBox}>
                                <Image source={require("../assets/Data/search.png")} style={styles.searchIcon} />
                                <TextInput
                                    ref={searchInputRef} // Sử dụng ref cho TextInput
                                    placeholder="Search"
                                    placeholderTextColor="#c6c9d1"
                                    style={[styles.searchInput, { outline: "none" }]}
                                    onChangeText={handleSearchChange}
                                    value={searchKeyword}
                                />
                            </Pressable>
                            <TouchableOpacity style={styles.filterButton}>
                                <MaterialIcons name="filter-list" size={16} color="black" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.categoriesHeader}>
                            <Text style={styles.categoriesTitle}>Categories</Text>
                            <TouchableOpacity style={styles.seeAllButton} onPress={() => setShowAllProducts((prev) => !prev)}>
                                <Text style={styles.seeAllText}>{showAllProducts ? "See less" : "See all"}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Categories */}
                        <View style={styles.categoriesContainer}>
                            <CategoryItem image={require("../assets/Data/smart.png")} backgroundColor="#dbcaf6" type="smart" />
                            <CategoryItem image={require("../assets/Data/ipad.png")} backgroundColor="#c5d1f7" type="ipad" />
                            <CategoryItem image={require("../assets/Data/macbook.png")} backgroundColor="#f8d8bf" type="macbook" />
                        </View>

                        <View style={styles.optionsContainer}>
                            <OptionItem title="Best Sales" />
                            <OptionItem title="Best Matched" />
                            <OptionItem title="Popular" />
                        </View>

                        {/* Product item */}
                        <View style={styles.productsContainer}>{renderProducts()}</View>

                        {/* Modal add */}
                        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={() => setVisible(false)}>
                <View style={styles.modalOverlay}>
                 <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add to cart</Text>
                {currentProduct && (
                    <>
                        <Image
                            source={{ uri: currentProduct.image }}
                            style={styles.modalProductImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.modalProductTitle}>{currentProduct.title}</Text>
                        <Text style={styles.modalProductPrice}>{currentProduct.price}</Text>
                        
                        {/* Thêm lựa chọn số lượng */}
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => setQuantity((prev) => Math.max(1, prev - 1))} // Giảm số lượng, không nhỏ hơn 1
                            >
                                <Text style={styles.quantityButtonText}>-</Text>
                            </TouchableOpacity>
                            <TextInput
                                style={styles.quantityInput}
                                keyboardType="numeric"
                                value={quantity.toString()}
                                onChangeText={(value) => setQuantity(Math.max(1, parseInt(value) || 1))} // Đảm bảo số lượng luôn >= 1
                            />
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => setQuantity((prev) => prev + 1)} // Tăng số lượng
                            >
                                <Text style={styles.quantityButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
                
                <View style={styles.modalButtonsContainer}>
                    <TouchableOpacity
                        style={[styles.modalButton, styles.cancelButton]}
                        onPress={() => setVisible(false)}
                    >
                        <Text style={styles.modalButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={[styles.modalButton, styles.addButton]}
                    onPress={() => {
                        // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
                        const existingProduct = cart.find(item => item.id === currentProduct.id);
                        if (existingProduct) {
                            // Nếu có, tăng số lượng
                            setCart((prev) => 
                                prev.map(item => 
                                    item.id === currentProduct.id 
                                    ? { ...item, quantity: item.quantity + quantity } 
                                    : item
                                )
                            );
                        } else {
                            // Nếu không có, thêm sản phẩm mới với số lượng
                            setCart((prev) => [...prev, { ...currentProduct, quantity }]);
                        }
                        alert("Add to cart successfully!");
                        setVisible(false);
                        setQuantity(1); // Reset lại số lượng sau khi thêm
                    }}
                >
                    <Text style={styles.modalButtonText}>Add</Text>
                </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>

                        {/* Button */}
                        <TouchableOpacity style={styles.seeAllProductsButton} onPress={() => setShowAllProducts((prev) => !prev)}>
                            <Text style={styles.seeAllProductsText}>{showAllProducts ? "See less" : "See all"}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    };

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === "Home") {
                        iconName = "home-outline";
                        return <Ionicons name={iconName} size={size} color={color} />;
                    } else if (route.name === "Search") {
                        iconName = "search-outline";
                        return <Ionicons name={iconName} size={size} color={color} />;
                    } else if (route.name === "Favorite") {
                        iconName = "hearto";
                        return (
                            <View>
                                <AntDesign name={iconName} size={size} color={color} />
                                <Text style={styles.badge}>99+</Text>
                            </View>
                        );
                    } else if (route.name === "Inbox") {
                        iconName = "message1";
                        return <AntDesign name={iconName} size={size} color={color} />;
                    } else if (route.name === "Account") {
                        iconName = "user";
                        return <AntDesign name={iconName} size={size} color={color} />;
                    }
                },
                tabBarActiveTintColor: "#00bbdf",
                tabBarInactiveTintColor: "gray",
                tabBarStyle: { paddingTop: 10, height: 60, paddingBottom: 10, borderBottomWidth: 0 },
                tabBarLabelStyle: { fontSize: 10, fontWeight: 700 },
            })}
        >
            <Tab.Screen name="Home" component={MainScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Search" component={MainScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Favorite" component={MainScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Inbox" component={MainScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Account" component={MainScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10,
    },
    backButtonText: {
        fontSize: 20,
        fontWeight: "600",
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "700",
    },
    headerIcons: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 6,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    searchContainer: {
        flexDirection: "row",
        columnGap: 14,
        marginTop: 24,
        height: 36,
    },
    searchBox: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
        paddingLeft: 10,
    },
    searchIcon: {
        height: 16,
        width: 16,
    },
    searchInput: {
        width: "100%",
        height: "100%",
        paddingLeft: 10,
    },
    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
        padding: 10,
    },
    categoriesHeader: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    categoriesTitle: {
        fontSize: 18,
        fontWeight: "700",
    },
    seeAllButton: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 6,
        marginRight: 14,
    },
    seeAllText: {
        color: "#c6c9d1",
    },
    seeAllArrow: {
        color: "#ccc",
    },
    categoriesContainer: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 20,
        marginTop: 10,
    },
    categoryItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        height: 100,
        borderWidth: 2,
    },
    optionsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    optionItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 26,
        borderRadius: 10,
    },
    productsContainer: {
        marginTop: 20,
        rowGap: 14,
    },
    productItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderWidth: 1,
        borderColor: "#dce1eb",
        borderRadius: 10,
    },
    productImage: {
        width: 60,
        height: 60,
    },
    productInfo: {
        rowGap: 12,
        marginLeft: 14,
    },
    productTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginTop: 10,
    },
    productPriceContainer: {
        marginLeft: "auto",
        rowGap: 4,
    },
    productPlusIcon: {
        width: 20,
        height: 20,
        marginLeft: "auto",
    },
    productPrice: {
        fontSize: 16,
        fontWeight: "bold",
    },
    seeAllProductsButton: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 14,
        height: 40,
        backgroundColor: "#f3f4f6",
        borderRadius: 10,
    },
    seeAllProductsText: {
        color: "#9e9ea6",
        fontWeight: "500",
    },
    badge: {
        position: "absolute",
        top: -3,
        right: -14,
        backgroundColor: "red",
        color: "white",
        borderRadius: 50,
        paddingHorizontal: 4,
        fontSize: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        alignItems: "center",
        width: "90%",
        height: "50%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
    },
    modalProductImage: {
        width: 100,
        height: 100,
        marginVertical: 20,
    },
    modalProductTitle: {
        fontSize: 16,
        fontWeight: "700",
    },
    modalProductPrice: {
        fontSize: 16,
        fontWeight: "bold",
        marginVertical: 10,
    },
    modalButtonsContainer: {
        width: "100%",
        marginTop: "auto",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10,
    },
    modalButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
    },
    cancelButton: {
        backgroundColor: "red",
    },
    addButton: {
        backgroundColor: "blue",
    },
    modalButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    quantityButton: {
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 5,
    },
    quantityButtonText: {
        fontSize: 20,
        color: '#333',
    },
    quantityInput: {
        width: 50,
        textAlign: 'center',
        fontSize: 18,
        marginHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center', // Căn giữa
    },
});

export default Screen_02;