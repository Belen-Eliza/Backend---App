import {
    Pressable,
    Text,
    TextInput,
    ScrollView,
    View,
    Platform,
    StyleSheet,
    Keyboard,
    KeyboardAvoidingView,
    Dimensions,
    TouchableWithoutFeedback,
  } from "react-native";
  import { estilos, colores } from "@/components/global_styles";
  import { useEffect, useState } from "react";
  import { useUserContext } from "@/context/UserContext";
  import { router } from "expo-router";
  import DateTimePicker, {
    DateTimePickerEvent,
    DateTimePickerAndroid,
    AndroidNativeProps,
  } from "@react-native-community/datetimepicker";
  import Toast from "react-native-toast-message";
  import { Dismiss_keyboard } from "@/components/botones";
  import { success_alert, error_alert } from "@/components/my_alert";
  
  import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
  } from "react-native-reanimated";
  
  type Presupuesto = {
    descripcion: string;
    montoTotal: number;
    cant_cuotas: number;
    fecha_objetivo: string;
    total_acumulado: number;
    user_id: number;
  };
  function es_valido(presupuesto: Presupuesto) {
    return (
      presupuesto.cant_cuotas != 0 &&
      presupuesto.descripcion.length != 0 &&
      presupuesto.montoTotal != 0
    );
  }
  
  export default function Presupuesto() {
    const context = useUserContext();
    const [presupuesto, setPresupuesto] = useState<Presupuesto>({
      descripcion: "",
      montoTotal: 0,
      cant_cuotas: 0,
      fecha_objetivo: "",
      total_acumulado: 0,
      user_id: context.id,
    });
    const [fecha, setFecha] = useState(new Date());
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(300);
  
    useEffect(() => {
      const showSubscription = Keyboard.addListener(
        "keyboardDidShow",
        handleKeyboardShow
      );
      const hideSubscription = Keyboard.addListener(
        "keyboardDidHide",
        handleKeyboardHide
      );
  
      return () => {
        showSubscription.remove();
      };
    }, []);
  
    const handleKeyboardShow = (event: any) => {
      setIsKeyboardVisible(true);
      setKeyboardHeight(event.endCoordinates.height);
    };
  
    const handleKeyboardHide = (event: any) => {
      setIsKeyboardVisible(false);
    };
  
    const handler_descripcion = (input: string) => {
      setPresupuesto((pre) => {
        pre.descripcion = input;
        return pre;
      });
    };
    const handler_monto = (input: string) => {
      let aux = Number(input.replace(",", "."));
      if (Number.isNaN(aux)) {
        error_alert("El valor ingresado debe ser un número");
      } else {
        setPresupuesto((pre) => {
          pre.montoTotal = aux;
          return pre;
        });
      }
    };
    const handler_cuotas = (input: string) => {
      let aux = Number(input.replace(",", "."));
      if (Number.isNaN(aux)) {
        error_alert("El valor ingresado debe ser un número");
      } else {
        setPresupuesto((pre) => {
          pre.cant_cuotas = aux;
          return pre;
        });
      }
    };
    const onChangeDate = (
      event: DateTimePickerEvent,
      selectedDate: Date | undefined
    ) => {
      let currentDate = new Date(0);
      if (selectedDate != undefined) currentDate = selectedDate;
      setFecha(currentDate);
    };
    const showMode = (currentMode: AndroidNativeProps["mode"]) => {
      DateTimePickerAndroid.open({
        value: fecha,
        onChange: onChangeDate,
        mode: currentMode,
        is24Hour: false,
        minimumDate: new Date(),
      });
    };
    const showDatepicker = () => {
      showMode("date");
    };
  
    const scale = useSharedValue(1);
  
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      };
    });
  
    const handlePressIn = () => {
      scale.value = withSpring(1.1, { damping: 5 });
    };
  
    const handlePressOut = () => {
      scale.value = withSpring(1, { damping: 5 });
    };
  
    const confirmar = async () => {
      presupuesto.fecha_objetivo = fecha.toISOString();
      presupuesto.user_id = context.id;
      presupuesto.total_acumulado = 0;
  
      if (!es_valido(presupuesto) || fecha <= new Date()) {
        error_alert(
          "Complete los espacios en blanco o proporcione una fecha objetivo válida"
        );
        return;
      }
  
      try {
        // Crear presupuesto
        const rsp = await fetch(
          `${process.env.EXPO_PUBLIC_DATABASE_URL}/presupuestos/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(presupuesto),
          }
        );
  
        if (!rsp.ok) {
          throw new Error("Error al crear el presupuesto");
        }
  
        const presupuestoCreado = await rsp.json(); // Obtener el presupuesto creado
  
        // Crear categoría asociada al presupuesto
        const nuevaCategoria = {
          nombre: presupuesto.descripcion, // Usa la descripción del presupuesto como nombre de la categoría
          user_id: context.id,
          presupuesto_id: presupuestoCreado.id, // Asociar al presupuesto creado
        };
  
        const rspCategoria = await fetch(
          `${process.env.EXPO_PUBLIC_DATABASE_URL}/categorias/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevaCategoria),
          }
        );
  
        if (!rspCategoria.ok) {
          throw new Error("Error al crear la categoría asociada");
        }
  
        // Si todo está bien, redirigir y mostrar éxito
        router.back();
        setTimeout(
          () => success_alert("Presupuesto y categoría creados correctamente"),
          200
        );
      } catch (e) {
        error_alert(String(e));
        console.log(e);
      }
    };
  
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={estilos.flex1}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={[estilos.mainView, { alignItems: "center" }]}>
            {isKeyboardVisible && (
              <Dismiss_keyboard
                setVisible={setIsKeyboardVisible}
                pos_y={Dimensions.get("screen").height - keyboardHeight - 150}
              />
            )}
            <ScrollView
              contentContainerStyle={[estilos.mainView, { alignItems: "center" }]}
              automaticallyAdjustKeyboardInsets={true}
            >
              <Text style={[estilos.subtitulo, estilos.poco_margen]}>Monto</Text>
              <TextInput
                style={[estilos.textInput, estilos.poco_margen]}
                keyboardType="decimal-pad"
                onChangeText={handler_monto}
                placeholder="Ingresar valor"
              ></TextInput>
  
              <Text style={estilos.subtitulo}>Cuotas</Text>
              <TextInput
                style={[estilos.textInput, estilos.poco_margen]}
                keyboardType="number-pad"
                onChangeText={handler_cuotas}
                placeholder="Ingresar cuotas"
              ></TextInput>
  
              <Text style={estilos.subtitulo}>Descripción</Text>
              <TextInput
                style={[estilos.textInput, estilos.poco_margen]}
                keyboardType="default"
                onChangeText={handler_descripcion}
              ></TextInput>
  
              <Text style={estilos.subtitulo}>Fecha objetivo:</Text>
              {Platform.OS === "android" ? (
                <View style={styles.androidDateTime}>
                  <Pressable onPress={showDatepicker}>
                    <Text style={estilos.show_date}>
                      {fecha.toLocaleDateString([], {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })}
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <DateTimePicker
                  style={estilos.margen}
                  value={fecha}
                  onChange={onChangeDate}
                  mode="date"
                  minimumDate={new Date()}
                />
              )}
  
              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={confirmar}
              >
                <Animated.View
                  style={[
                    estilos.tarjeta,
                    estilos.centrado,
                    colores.botones,
                    { maxHeight: 50 },
                    animatedStyle,
                  ]}
                >
                  <Text style={estilos.subtitulo}>Confirmar</Text>
                </Animated.View>
              </Pressable>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
        <Toast />
      </KeyboardAvoidingView>
    );
  }
  
  const styles = StyleSheet.create({
    androidDateTime: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
  });
  