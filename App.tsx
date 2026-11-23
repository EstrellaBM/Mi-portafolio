import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert,
  LayoutChangeEvent,
  ImageSourcePropType,
  Dimensions,
} from "react-native";
// 👇 1. PON AQUÍ LA RUTA DE LA IMAGEN GRANDE DE TU CV (para visualizarlo)
const IMAGEN_CV: ImageSourcePropType = require("./assets/cv_preview.jpg");

// 👇 2. PON AQUÍ LA RUTA DE TU PDF (para descargarlo/abrirlo)
// Si aún no configuras .pdf en metro.config.js, puedes dejarlo en null temporalmente
const RUTA_CV_PDF: number | null = require("./assets/cv.pdf");

type Proyecto = {
  id: number;
  nombre: string;
  descripcionCorta: string;
  descripcionCompleta: string;
  imagen: ImageSourcePropType;
  tecnologías: string[];
};

type SeccionKey = "inicio" | "proyectos" | "cv" | "contactos";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function App() {
  const scrollViewRef = useRef<React.ElementRef<typeof ScrollView> | null>(
    null,
  );
  const sectionOffsets = useRef<Record<SeccionKey, number>>({
    inicio: 0,
    proyectos: 0,
    cv: 0,
    contactos: 0,
  });

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState<SeccionKey>("inicio");
  const [modalProyectoVisible, setModalProyectoVisible] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] =
    useState<Proyecto | null>(null);
  const [modalCvImagenVisible, setModalCvImagenVisible] = useState(false);
  const [descargandoCv, setDescargandoCv] = useState(false);

  const persona = {
    nombre: "Estrella Briones Moncada",
    profesión: "Software Development Engineer",
    descripción:
      "Apasionada por la tecnología, la arquitectura de software y el desarrollo móvil/web. Enfoque en crear soluciones digitales intuitivas y eficientes.",
    correo: "brestrella555@gmail.com",
    github: "https://github.com/estrellabm",
    linkedin: "https://linkedin.com/in/estrellabriones",
    ubicación: "México",
    formación:
      "Ingeniería en Sistemas y Desarrollo de Software — Universidad Tecnológica De La Laguna Durango",
  };

  const seccionesMenu: { key: SeccionKey; label: string }[] = [
    { key: "inicio", label: "Inicio" },
    { key: "proyectos", label: "Proyectos" },
    { key: "cv", label: "CV" },
    { key: "contactos", label: "Contactos" },
  ];

  const habilidades: string[] = [
    "React Native",
    "TypeScript",
    "JavaScript",
    "React.js",
    "Node.js",
    "HTML5 / CSS3",
    "PostgreSQL",
    "MySQL",
    "Git / GitHub",
    "Figma (UI/UX)",
  ];

  const proyectos: Proyecto[] = [
    {
      id: 1,
      nombre: "Memori App",
      descripcionCorta: "Asistente digital de recuerdos y notas personales.",
      descripcionCompleta:
        "Memori es una aplicación móvil diseñada para registrar y recordar vivencias personales, notas y fotografías utilizando reconocimiento de voz y almacenamiento seguro. Desarrollada con React Native y TypeScript.",
      imagen: require("./assets/memori.png"),
      tecnologías: ["React Native", "TypeScript", "Expo", "Voice API"],
    },
    {
      id: 2,
      nombre: "Sistema de Inventario MPCC",
      descripcionCorta: "Plataforma web para gestión de inventarios.",
      descripcionCompleta:
        "Sistema integral de control de inventarios desarrollado para Mantenimientos Preventivos y Correctivos Cortez. Facilita el rastreo de herramientas, repuestos y la gestión de órdenes de trabajo en tiempo real.",
      imagen: require("./assets/inventario.png"),
      tecnologías: ["React", "JavaScript", "PostgreSQL", "HTML/CSS"],
    },
    {
      id: 3,
      nombre: "Hospital Management",
      descripcionCorta: "Gestión y agendamiento de citas médicas.",
      descripcionCompleta:
        "Aplicación móvil para la administración de consultas hospitalarias. Permite a los pacientes agendar citas con especialistas, consultar historiales y recibir notificaciones de seguimiento.",
      imagen: require("./assets/hospital.png"),
      tecnologías: ["React Native", "Expo", "UI Design"],
    },
    {
      id: 4,
      nombre: "To-Do List Manager",
      descripcionCorta: "Administrador de tareas académicas.",
      descripcionCompleta:
        "Herramienta móvil enfocada en la productividad estudiantil. Organiza entregas, proyectos universitarios y tareas diarias mediante recordatorios y priorización de pendientes.",
      imagen: require("./assets/todo.png"),
      tecnologías: ["React Native", "TypeScript"],
    },
  ];

  const registrarPosicion =
    (seccion: SeccionKey) => (event: LayoutChangeEvent) => {
      sectionOffsets.current[seccion] = event.nativeEvent.layout.y;
    };

  const navegarASeccion = (seccion: SeccionKey): void => {
    setSeccionActiva(seccion);
    setMenuAbierto(false);

    const destinoY = sectionOffsets.current[seccion] ?? 0;
    scrollViewRef.current?.scrollTo({
      y: Math.max(0, destinoY - 68),
      animated: true,
    });
  };

  const abrirEnlace = async (url: string): Promise<void> => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("No se pudo abrir el enlace:", error);
      Alert.alert("Aviso", "No fue posible abrir el enlace solicitado.");
    }
  };

  const handleVerCv = (): void => {
    setModalCvImagenVisible(true);
  };

  const handleDescargarCv = async (): Promise<void> => {
    try {
      setDescargandoCv(true);

      if (!RUTA_CV_PDF) {
        Alert.alert(
          "PDF no configurado",
          "Coloca tu archivo cv.pdf en ./assets/ y configura RUTA_CV_PDF para descargarlo.",
        );
        return;
      }

      Alert.alert(
        "CV en PDF",
        "El PDF está disponible en el proyecto, pero se requiere configurar expo-asset para abrirlo desde la aplicación.",
      );
    } catch (error) {
      console.error("Error al descargar/abrir CV PDF:", error);
      Alert.alert(
        "Aviso",
        "Asegúrate de tener configurado .pdf en metro.config.js y reiniciar con npx expo start -c.",
      );
    } finally {
      setDescargandoCv(false);
    }
  };

  const verDetalleProyecto = (proyecto: Proyecto): void => {
    setProyectoSeleccionado(proyecto);
    setModalProyectoVisible(true);
  };

  const cerrarModalProyecto = (): void => {
    setModalProyectoVisible(false);
    setProyectoSeleccionado(null);
  };

  const anchoImagenCv = Math.min(SCREEN_WIDTH - 48, 780);
  const altoImagenCv = Math.max(SCREEN_HEIGHT * 1.15, anchoImagenCv * 1.35);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <View style={styles.screenWrapper}>
        {/* BARRA SUPERIOR FIJA VISIBLE EN CUALQUIER APARTADO */}
        <View style={styles.stickyNavbar}>
          <View>
            <Text style={styles.navbarBrand}>PORTAFOLIO</Text>
            <Text style={styles.navbarSub}>Desarrollo de Software</Text>
          </View>

          <TouchableOpacity
            style={styles.menuButton}
            activeOpacity={0.8}
            onPress={() => setMenuAbierto((prev) => !prev)}
          >
            <Text style={styles.menuButtonText}>
              {menuAbierto ? "Cerrar" : "Menú"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* MENÚ DESPLEGABLE FLOTANTE */}
        {menuAbierto && (
          <View style={styles.floatingDropdown}>
            {seccionesMenu.map((item, idx) => {
              const activa = seccionActiva === item.key;
              const esUltimo = idx === seccionesMenu.length - 1;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.dropdownItem,
                    activa && styles.dropdownItemActive,
                    esUltimo && styles.dropdownItemLast,
                  ]}
                  activeOpacity={0.75}
                  onPress={() => navegarASeccion(item.key)}
                >
                  <Text
                    style={[
                      styles.dropdownLabel,
                      activa && styles.dropdownLabelActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={[
                      styles.dropdownIndicator,
                      activa && styles.dropdownLabelActive,
                    ]}
                  >
                    {activa ? "Actual" : "Ir"}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <ScrollView
          ref={scrollViewRef}
          style={styles.container}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={() => {
            if (menuAbierto) setMenuAbierto(false);
          }}
        >
          {/* BANNER INICIO */}
          <View
            style={styles.heroBanner}
            onLayout={registrarPosicion("inicio")}
          >
            <Text style={styles.heroTitle}>{persona.nombre}</Text>
            <Text style={styles.heroSubtitle}>{persona.profesión}</Text>
          </View>

          {/* PERFIL */}
          <View style={styles.profileCard}>
            <Image
              source={require("./assets/me.jpeg")}
              style={styles.photo}
              resizeMode="cover"
            />

            <View style={styles.badge}>
              <Text style={styles.profession}>{persona.profesión}</Text>
            </View>

            <Text style={styles.description}>{persona.descripción}</Text>
          </View>

          {/* INFORMACIÓN PERSONAL */}
          <View style={styles.section}>
            <Text style={styles.title}>Información Personal</Text>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Correo</Text>
                <Text style={styles.infoText}>{persona.correo}</Text>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Ubicación</Text>
                <Text style={styles.infoText}>{persona.ubicación}</Text>
              </View>
            </View>
          </View>

          {/* HABILIDADES */}
          <View style={styles.section}>
            <Text style={styles.title}>Tecnologías y Habilidades</Text>

            <View style={styles.skillsContainer}>
              {habilidades.map((skill, index) => (
                <View key={index} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* PROYECTOS */}
          <View
            style={styles.section}
            onLayout={registrarPosicion("proyectos")}
          >
            <Text style={styles.title}>Proyectos Realizados</Text>

            <Text style={styles.instructionText}>
              Selecciona cualquier proyecto para consultar su detalle.
            </Text>

            {proyectos.map((proyecto) => (
              <TouchableOpacity
                key={proyecto.id}
                style={styles.projectCard}
                activeOpacity={0.75}
                onPress={() => verDetalleProyecto(proyecto)}
              >
                <View style={styles.projectHeaderRow}>
                  <Text style={styles.projectName}>{proyecto.nombre}</Text>
                  <Text style={styles.openText}>Ver detalle</Text>
                </View>

                <Text style={styles.projectDescription}>
                  {proyecto.descripcionCorta}
                </Text>

                <View style={styles.techTagsContainer}>
                  {proyecto.tecnologías.map((tech, index) => (
                    <View key={index} style={styles.techTag}>
                      <Text style={styles.techTagText}>{tech}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* CURRÍCULUM VITAE (CV) */}
          <View style={styles.section} onLayout={registrarPosicion("cv")}>
            <Text style={styles.title}>Currículum Vitae</Text>

            <View style={styles.cvCard}>
              <Text style={styles.cvCardTitle}>Hoja de Vida Profesional</Text>
              <Text style={styles.cvCardSubtitle}>
                Visualiza el documento completo en imagen o descarga el PDF.
              </Text>

              <Text style={styles.cvSummary}>{persona.formación}</Text>

              <View style={styles.cvButtonsRow}>
                <TouchableOpacity
                  style={styles.cvButtonView}
                  activeOpacity={0.85}
                  onPress={handleVerCv}
                >
                  <Text style={styles.cvButtonViewText}>Ver CV</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cvButtonDownload}
                  activeOpacity={0.85}
                  disabled={descargandoCv}
                  onPress={handleDescargarCv}
                >
                  <Text style={styles.cvButtonDownloadText}>
                    {descargandoCv ? "Abriendo..." : "Descargar CV"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* CONTACTO */}
          <View
            style={styles.section}
            onLayout={registrarPosicion("contactos")}
          >
            <Text style={styles.title}>Contacto y Redes</Text>

            <View style={styles.contactButtonsContainer}>
              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={() => abrirEnlace(`mailto:${persona.correo}`)}
              >
                <Text style={styles.buttonText}>Enviar Correo</Text>
              </TouchableOpacity>

              <View style={styles.socialButtonsRow}>
                <TouchableOpacity
                  style={styles.buttonSecondary}
                  onPress={() => abrirEnlace(persona.github)}
                >
                  <Text style={styles.buttonSecondaryText}>GitHub</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buttonSecondary}
                  onPress={() => abrirEnlace(persona.linkedin)}
                >
                  <Text style={styles.buttonSecondaryText}>LinkedIn</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>2026 • {persona.nombre}</Text>
          </View>
        </ScrollView>
      </View>

      {/* MODAL DE PROYECTOS CON BOTÓN X */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalProyectoVisible}
        onRequestClose={cerrarModalProyecto}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={cerrarModalProyecto}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {proyectoSeleccionado !== null && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScrollContainer}
              >
                <View style={styles.projectModalTopBar}>
                  <Text style={styles.projectModalHeaderTitle}>
                    Detalle del Proyecto
                  </Text>
                  <TouchableOpacity
                    style={styles.closeXButton}
                    activeOpacity={0.8}
                    onPress={cerrarModalProyecto}
                  >
                    <Text style={styles.closeXText}>X</Text>
                  </TouchableOpacity>
                </View>

                <Image
                  source={proyectoSeleccionado.imagen}
                  style={styles.modalImage}
                  resizeMode="cover"
                />

                <Text style={styles.modalTitle}>
                  {proyectoSeleccionado.nombre}
                </Text>

                <View style={styles.techTagsContainer}>
                  {proyectoSeleccionado.tecnologías.map((tech, index) => (
                    <View key={index} style={styles.techTag}>
                      <Text style={styles.techTagText}>{tech}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.modalSubTitle}>Descripción General</Text>

                <Text style={styles.modalDescription}>
                  {proyectoSeleccionado.descripcionCompleta}
                </Text>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={cerrarModalProyecto}
                  activeOpacity={0.8}
                >
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* MODAL GRANDE DE IMAGEN DEL CV */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalCvImagenVisible}
        onRequestClose={() => setModalCvImagenVisible(false)}
      >
        <View style={styles.cvFullOverlay}>
          <View style={styles.cvFullCard}>
            <View style={styles.cvFullTopBar}>
              <Text style={styles.cvFullTitle}>Currículum Vitae</Text>
              <TouchableOpacity
                style={styles.closeXButton}
                onPress={() => setModalCvImagenVisible(false)}
              >
                <Text style={styles.closeXText}>X</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.cvImageScroll}
              contentContainerStyle={styles.cvImageScrollContent}
              showsVerticalScrollIndicator={true}
              showsHorizontalScrollIndicator={false}
            >
              <Image
                source={IMAGEN_CV}
                style={[
                  styles.cvFullImage,
                  { width: anchoImagenCv, height: altoImagenCv },
                ]}
                resizeMode="stretch"
              />
            </ScrollView>

            <View style={styles.cvFullBottomActions}>
              <TouchableOpacity
                style={styles.cvButtonDownload}
                activeOpacity={0.85}
                onPress={handleDescargarCv}
              >
                <Text style={styles.cvButtonDownloadText}>Descargar CV</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cvFullCloseButton}
                activeOpacity={0.85}
                onPress={() => setModalCvImagenVisible(false)}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ==========================================
// ESTILOS PLANOS Y ELEGANTES
// ==========================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#4C1D95",
  },
  screenWrapper: {
    flex: 1,
    backgroundColor: "#FAF5FF",
  },
  stickyNavbar: {
    backgroundColor: "#4C1D95",
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#5B21B6",
    zIndex: 30,
  },
  navbarBrand: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.6,
  },
  navbarSub: {
    color: "#DDD6FE",
    fontSize: 12,
    marginTop: 2,
  },
  menuButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#5B21B6",
    borderWidth: 1,
    borderColor: "#A78BFA",
  },
  menuButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  floatingDropdown: {
    position: "absolute",
    top: 68,
    right: 18,
    width: 210,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DDD6FE",
    zIndex: 40,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3E8FF",
  },
  dropdownItemActive: {
    backgroundColor: "#F5F3FF",
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3B0764",
  },
  dropdownLabelActive: {
    color: "#6D28D9",
    fontWeight: "700",
  },
  dropdownIndicator: {
    fontSize: 12,
    color: "#8B5CF6",
    fontWeight: "500",
  },
  container: {
    flex: 1,
    backgroundColor: "#FAF5FF",
  },
  heroBanner: {
    backgroundColor: "#4C1D95",
    paddingTop: 18,
    paddingBottom: 46,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "700",
    textAlign: "center",
  },
  heroSubtitle: {
    color: "#DDD6FE",
    fontSize: 13,
    marginTop: 4,
    letterSpacing: 0.4,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 18,
    marginTop: -28,
    marginBottom: 20,
    padding: 22,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  photo: {
    width: 108,
    height: 108,
    borderRadius: 54,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#8B5CF6",
  },
  badge: {
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  profession: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6D28D9",
  },
  description: {
    color: "#4B5563",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 20,
    fontSize: 14,
  },
  section: {
    marginHorizontal: 18,
    marginBottom: 22,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3B0764",
    marginBottom: 6,
  },
  instructionText: {
    color: "#6D28D9",
    fontSize: 12,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E9D5FF",
    marginTop: 6,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  infoLabel: {
    color: "#6D28D9",
    fontSize: 13,
    fontWeight: "600",
  },
  infoText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#F3E8FF",
    marginVertical: 2,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  skillBadge: {
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDD6FE",
  },
  skillText: {
    color: "#5B21B6",
    fontSize: 13,
    fontWeight: "600",
  },
  projectCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E9D5FF",
    borderLeftWidth: 4,
    borderLeftColor: "#7C3AED",
  },
  projectHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  projectName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#2E1065",
  },
  openText: {
    fontSize: 12,
    color: "#6D28D9",
    fontWeight: "600",
  },
  projectDescription: {
    color: "#6B7280",
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  techTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    gap: 6,
  },
  techTag: {
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EDE9FE",
  },
  techTagText: {
    color: "#6D28D9",
    fontSize: 12,
    fontWeight: "600",
  },
  cvCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E9D5FF",
    marginTop: 6,
  },
  cvCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E1065",
  },
  cvCardSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 3,
  },
  cvSummary: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 19,
    color: "#4B5563",
  },
  cvButtonsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  cvButtonView: {
    flex: 1,
    backgroundColor: "#5B21B6",
    paddingVertical: 13,
    borderRadius: 13,
    alignItems: "center",
  },
  cvButtonViewText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  cvButtonDownload: {
    flex: 1,
    backgroundColor: "#FAF5FF",
    borderWidth: 1,
    borderColor: "#7C3AED",
    paddingVertical: 13,
    borderRadius: 13,
    alignItems: "center",
  },
  cvButtonDownloadText: {
    color: "#5B21B6",
    fontWeight: "600",
    fontSize: 14,
  },
  contactButtonsContainer: {
    gap: 10,
    marginTop: 6,
  },
  buttonPrimary: {
    backgroundColor: "#6D28D9",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  socialButtonsRow: {
    flexDirection: "row",
    gap: 10,
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderColor: "#8B5CF6",
    borderWidth: 1,
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonSecondaryText: {
    color: "#5B21B6",
    fontWeight: "600",
    fontSize: 14,
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  footerText: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(30, 10, 60, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxHeight: "84%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E9D5FF",
    overflow: "hidden",
  },
  modalScrollContainer: {
    padding: 20,
  },
  projectModalTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  projectModalHeaderTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6D28D9",
  },
  closeXButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#5B21B6",
    borderWidth: 1,
    borderColor: "#A78BFA",
    justifyContent: "center",
    alignItems: "center",
  },
  closeXText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  modalImage: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E1065",
    marginBottom: 8,
  },
  modalSubTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#3B0764",
    marginTop: 16,
    marginBottom: 6,
  },
  modalDescription: {
    color: "#4B5563",
    fontSize: 14,
    lineHeight: 22,
  },
  cvFullOverlay: {
    flex: 1,
    backgroundColor: "rgba(20, 8, 45, 0.78)",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  cvFullCard: {
    width: "100%",
    height: "94%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDD6FE",
    overflow: "hidden",
  },
  cvFullTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4C1D95",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cvFullTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  cvImageScroll: {
    flex: 1,
    backgroundColor: "#FAF5FF",
  },
  cvImageScrollContent: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  cvFullImage: {
    borderRadius: 12,
  },
  cvFullBottomActions: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EDE9FE",
  },
  cvFullCloseButton: {
    flex: 1,
    backgroundColor: "#6D28D9",
    paddingVertical: 13,
    borderRadius: 13,
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#6D28D9",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 18,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
});
