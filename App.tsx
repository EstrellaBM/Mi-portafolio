import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
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
  useWindowDimensions,
} from "react-native";

const IMAGEN_CV: ImageSourcePropType = require("./assets/cv_preview.jpg");
const URL_CORREO_OFICIAL = "https://mail.google.com";

type Proyecto = {
  id: string;
  name: string;
  description: string;
  descripcionCompleta: string;
  image: ImageSourcePropType;
  technologies: string[];
  url: string;
};

type SeccionKey = "inicio" | "proyectos" | "cv" | "contactos";

export default function App() {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  const isLargeScreen = width >= 1024;
  const isLandscape = width > height;

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
  const [selectedSection, setSelectedSection] = useState<string>("home");
  const [selectedProject, setSelectedProject] = useState<Proyecto | null>(null);
  const [modalProyectoVisible, setModalProyectoVisible] = useState(false);
  const [modalCvImagenVisible, setModalCvImagenVisible] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const persona = {
    nombre: "Estrella Briones Moncada",
    profesión: "Software Development Engineer",
    descripción:
      "Apasionada por la tecnología, la arquitectura de software y el desarrollo de aplicaciones. Enfoque en crear soluciones digitales intuitivas y eficientes.",
    correo: "brestrella555@gmail.com",
    correoWeb: URL_CORREO_OFICIAL,
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

  const projects: Proyecto[] = [
    {
      id: "1",
      name: "Memori App",
      description: "Asistente digital de recuerdos y notas personales.",
      descripcionCompleta:
        "Memori es una aplicación móvil diseñada para registrar y recordar vivencias personales, notas y fotografías utilizando reconocimiento de voz y almacenamiento seguro. Desarrollada con React Native y TypeScript.",
      image: require("./assets/memori.png"),
      technologies: ["React Native", "TypeScript", "Expo", "Voice API"],
      url: "https://github.com/estrellabm/memori-app",
    },
    {
      id: "2",
      name: "Sistema de Inventario MPCC",
      description: "Plataforma web para gestión de inventarios.",
      descripcionCompleta:
        "Sistema integral de control de inventarios desarrollado para Mantenimientos Preventivos y Correctivos Cortez. Facilita el rastreo de herramientas, repuestos y la gestión de órdenes de trabajo en tiempo real.",
      image: require("./assets/inventario.png"),
      technologies: ["React", "JavaScript", "PostgreSQL", "HTML/CSS"],
      url: "https://github.com/estrellabm/inventario-mpcc",
    },
    {
      id: "3",
      name: "Hospital Management",
      description: "Gestión y agendamiento de citas médicas.",
      descripcionCompleta:
        "Aplicación móvil para la administración de consultas hospitalarias. Permite a los pacientes agendar citas con especialistas, consultar historiales y recibir notificaciones de seguimiento.",
      image: require("./assets/hospital.png"),
      technologies: ["React Native", "Expo", "UI Design"],
      url: "https://github.com/estrellabm/hospital-management",
    },
    {
      id: "4",
      name: "Agenda",
      description: "Aplicacion sobre un todolist.",
      descripcionCompleta:
        "Esta aplicacion es muy util para llevar un control de tareas y actividades teniendo todoa la mano y de manera facil",
      image: require("./assets/todo.png"),
      technologies: ["React Native", "TypeScript"],
      url: "https://github.com/estrellabm/mi-primera-aplicacion",
    },
    {
      id: "5",
      name: "Mi primera aplicación",
      description:
        "Aplicación desarrollada durante el curso de desarrollo móvil.",
      descripcionCompleta:
        "Proyecto creado durante el curso de desarrollo móvil para practicar componentes, navegación, estados y diseño de interfaces en React Native con TypeScript.",
      image: require("./assets/porfolio.png"),
      technologies: ["React Native", "TypeScript"],
      url: "https://github.com/estrellabm/mi-primera-aplicacion",
    },
  ];

  const proyectosFiltrados = projects.filter((proyecto) =>
    proyecto.name.toLowerCase().includes(busqueda.trim().toLowerCase()),
  );

  const limpiarBusqueda = (): void => {
    setBusqueda("");
  };

  const navigate = (section: string): void => {
    setSelectedSection(section);
    setSelectedProject(null);
  };

  const registrarPosicion =
    (seccion: SeccionKey) => (event: LayoutChangeEvent) => {
      sectionOffsets.current[seccion] = event.nativeEvent.layout.y;
    };

  const navegarASeccion = (seccion: SeccionKey): void => {
    setSeccionActiva(seccion);
    navigate(seccion);
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

  const verDetalleProyecto = (proyecto: Proyecto): void => {
    setSelectedProject(proyecto);
    setModalProyectoVisible(true);
  };

  const cerrarModalProyecto = (): void => {
    setModalProyectoVisible(false);
    setSelectedProject(null);
  };

  const horizontalPadding = isLargeScreen ? 32 : isTablet ? 24 : 18;
  const projectColumns = isLargeScreen ? 3 : isTablet ? 2 : 1;
  const projectCardWidth =
    projectColumns === 1 ? "100%" : `${Math.floor(100 / projectColumns) - 2}%`;

  const altoImagenModalProyecto = isTablet ? 175 : isLandscape ? 105 : 135;

  const anchoImagenCv = Math.min(width - horizontalPadding * 2 - 20, 820);
  const altoImagenCv = isLandscape
    ? Math.max(height * 1.4, anchoImagenCv * 1.35)
    : Math.max(height * 1.15, anchoImagenCv * 1.35);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <View style={styles.screenWrapper}>
        <View
          style={[
            styles.stickyNavbar,
            { paddingHorizontal: horizontalPadding },
          ]}
        >
          <View>
            <Text style={[styles.navbarBrand, isTablet && { fontSize: 18 }]}>
              PORTAFOLIO
            </Text>
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

        {menuAbierto && (
          <View style={[styles.floatingDropdown, { right: horizontalPadding }]}>
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
          <View
            style={[
              styles.heroBanner,
              { paddingHorizontal: horizontalPadding },
            ]}
            onLayout={registrarPosicion("inicio")}
          >
            <Text style={[styles.heroTitle, isTablet && { fontSize: 25 }]}>
              {persona.nombre}
            </Text>
            <Text style={[styles.heroSubtitle, isTablet && { fontSize: 15 }]}>
              {persona.profesión}
            </Text>
          </View>

          <View
            style={[
              styles.profileCard,
              { marginHorizontal: horizontalPadding },
              isLandscape && !isTablet && styles.profileCardLandscape,
            ]}
          >
            <Image
              source={require("./assets/me.jpeg")}
              style={[
                styles.photo,
                isTablet && { width: 124, height: 124, borderRadius: 62 },
              ]}
              resizeMode="cover"
            />

            <View
              style={
                isLandscape && !isTablet
                  ? styles.profileTextCol
                  : { alignItems: "center" }
              }
            >
              <View style={styles.badge}>
                <Text style={styles.profession}>{persona.profesión}</Text>
              </View>

              <Text
                style={[
                  styles.description,
                  isLandscape && !isTablet && { textAlign: "left" },
                ]}
              >
                {persona.descripción}
              </Text>
            </View>
          </View>

          <View
            style={[styles.section, { marginHorizontal: horizontalPadding }]}
          >
            <Text style={styles.title}>Información Personal</Text>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Correo</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => abrirEnlace(persona.correoWeb)}
                >
                  <Text style={styles.infoLinkText}>{persona.correo}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Ubicación</Text>
                <Text style={styles.infoText}>{persona.ubicación}</Text>
              </View>
            </View>
          </View>

          <View
            style={[styles.section, { marginHorizontal: horizontalPadding }]}
          >
            <Text style={styles.title}>Tecnologías y Habilidades</Text>

            <View style={styles.skillsContainer}>
              {habilidades.map((skill, index) => (
                <View key={index} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          <View
            style={[styles.section, { marginHorizontal: horizontalPadding }]}
            onLayout={registrarPosicion("proyectos")}
          >
            <Text style={styles.title}>Busca tus proyectos</Text>

            <Text style={styles.instructionText}>
              Busca los proyectos por nombre.
            </Text>

            <View style={styles.searchWrapper}>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar proyecto por nombre..."
                placeholderTextColor="#9CA3AF"
                value={busqueda}
                onChangeText={setBusqueda}
                autoCorrect={false}
                clearButtonMode="never"
              />
              {busqueda.length > 0 && (
                <TouchableOpacity
                  style={styles.clearSearchButton}
                  activeOpacity={0.8}
                  onPress={limpiarBusqueda}
                >
                  <Text style={styles.clearSearchText}>Limpiar</Text>
                </TouchableOpacity>
              )}
            </View>

            {proyectosFiltrados.length === 0 ? (
              <View style={styles.emptyStateCard}>
                <Text style={styles.emptyStateText}>
                  No se encontraron proyectos
                </Text>
                <TouchableOpacity
                  style={styles.emptyResetButton}
                  activeOpacity={0.8}
                  onPress={limpiarBusqueda}
                >
                  <Text style={styles.emptyResetText}>Mostrar todos</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.projectsGrid}>
                {proyectosFiltrados.map((proyecto) => (
                  <TouchableOpacity
                    key={proyecto.id}
                    style={[
                      styles.projectCard,
                      projectColumns > 1 && { width: projectCardWidth },
                    ]}
                    activeOpacity={0.75}
                    onPress={() => verDetalleProyecto(proyecto)}
                  >
                    <View style={styles.projectHeaderRow}>
                      <Text style={styles.projectName}>{proyecto.name}</Text>
                      <Text style={styles.openText}>Ver detalle</Text>
                    </View>

                    <Text style={styles.projectDescription}>
                      {proyecto.description}
                    </Text>

                    <View style={styles.techTagsContainer}>
                      {proyecto.technologies.map((tech, index) => (
                        <View key={index} style={styles.techTag}>
                          <Text style={styles.techTagText}>{tech}</Text>
                        </View>
                      ))}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View
            style={[styles.section, { marginHorizontal: horizontalPadding }]}
            onLayout={registrarPosicion("cv")}
          >
            <Text style={styles.title}>Currículum Vitae</Text>

            <View style={styles.cvCard}>
              <Text style={styles.cvCardTitle}>Hoja de Vida Profesional</Text>
              <Text style={styles.cvCardSubtitle}>
                Visualiza el documento completo en imagen.
              </Text>

              <Text style={styles.cvSummary}>{persona.formación}</Text>

              <View style={styles.cvButtonsRow}>
                <TouchableOpacity
                  style={styles.cvButtonViewFull}
                  activeOpacity={0.85}
                  onPress={handleVerCv}
                >
                  <Text style={styles.cvButtonViewText}>Ver CV</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View
            style={[styles.section, { marginHorizontal: horizontalPadding }]}
            onLayout={registrarPosicion("contactos")}
          >
            <Text style={styles.title}>Contacto y Redes</Text>

            <View style={styles.contactButtonsContainer}>
              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={() => abrirEnlace(persona.correoWeb)}
              >
                <Text style={styles.buttonText}>Enviar Mensaje</Text>
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

          <View style={styles.footer}>
            <Text style={styles.footerText}>2026 • {persona.nombre}</Text>
          </View>
        </ScrollView>
      </View>

      <Modal
        animationType="fade"
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
            style={[
              styles.modalContent,
              isTablet
                ? { maxWidth: 720, maxHeight: "92%" }
                : { maxHeight: "94%" },
            ]}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {selectedProject !== null && (
              <View style={styles.modalInner}>
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

                <View style={styles.modalImageFrame}>
                  <Image
                    source={selectedProject.image}
                    style={[
                      styles.modalImage,
                      { height: altoImagenModalProyecto },
                    ]}
                    resizeMode="contain"
                  />
                </View>

                <Text style={styles.modalTitle}>{selectedProject.name}</Text>

                <View style={styles.techTagsContainer}>
                  {selectedProject.technologies.map((tech, index) => (
                    <View key={index} style={styles.techTag}>
                      <Text style={styles.techTagText}>{tech}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.modalSubTitle}>Descripción General</Text>
                <Text style={styles.modalDescription}>
                  {selectedProject.descripcionCompleta}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalCvImagenVisible}
        onRequestClose={() => setModalCvImagenVisible(false)}
      >
        <View style={styles.cvFullOverlay}>
          <View style={[styles.cvFullCard, isTablet && { maxWidth: 880 }]}>
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
                resizeMode="contain"
              />
            </ScrollView>

            <View style={styles.cvFullBottomActions}>
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
    marginTop: -28,
    marginBottom: 20,
    padding: 22,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  profileCardLandscape: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  profileTextCol: {
    flex: 1,
    alignItems: "flex-start",
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
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDD6FE",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: "#2E1065",
  },
  clearSearchButton: {
    backgroundColor: "#EDE9FE",
    borderWidth: 1,
    borderColor: "#C4B5FD",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  clearSearchText: {
    color: "#5B21B6",
    fontSize: 13,
    fontWeight: "600",
  },
  emptyStateCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E9D5FF",
    padding: 20,
    alignItems: "center",
    gap: 12,
  },
  emptyStateText: {
    color: "#4B5563",
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
  },
  emptyResetButton: {
    backgroundColor: "#6D28D9",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
  },
  emptyResetText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
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
    flexWrap: "wrap",
    gap: 8,
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
  infoLinkText: {
    color: "#5B21B6",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
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
  projectsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  projectCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E9D5FF",
    borderLeftWidth: 4,
    borderLeftColor: "#7C3AED",
  },
  projectHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
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
    marginTop: 8,
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
    marginTop: 16,
  },
  cvButtonViewFull: {
    width: "100%",
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
    flexWrap: "wrap",
    gap: 10,
  },
  buttonSecondary: {
    flex: 1,
    minWidth: 130,
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
    padding: 14,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E9D5FF",
    overflow: "hidden",
  },
  modalInner: {
    padding: 18,
  },
  projectModalTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
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
  modalImageFrame: {
    backgroundColor: "#F5F3FF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EDE9FE",
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  modalImage: {
    width: "100%",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#2E1065",
    marginBottom: 4,
  },
  modalSubTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3B0764",
    marginTop: 12,
    marginBottom: 4,
  },
  modalDescription: {
    color: "#4B5563",
    fontSize: 13,
    lineHeight: 19,
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
  closeButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
