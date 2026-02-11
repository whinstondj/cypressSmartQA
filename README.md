# 🚀 Cypress Smart QA

Automatización de pruebas E2E para funcionalidades de blog usando Cypress. Este proyecto implementa pruebas robustas y escalables para validar el flujo completo de comentarios en blogs de WordPress.

## 📋 Características

- ✅ **Pruebas E2E automatizadas** para funcionalidades de comentarios
- 🔧 **Page Object Model** para mejor mantenimiento del código
- 🛡️ **Selectores robustos** con múltiples fallbacks
- 📝 **Logging detallado** para debugging eficiente
- 🌐 **Soporte multi-idioma** (Español/Inglés)
- 🎯 **Manejo inteligente** de modales y elementos dinámicos

## 🏗️ Estructura del Proyecto

```
cypress/
├── e2e/
│   ├── comment_happy_path.cy.js    # Test principal de comentarios
│   └── primera.cy.js               # Test base
├── fixtures/
│   └── example.json                # Datos de prueba
└── support/
    ├── commands.js                 # Comandos personalizados
    ├── e2e.js                     # Configuración global
    └── actions/
        └── BlogActions.js          # Page Object para acciones del blog
```

## 🚀 Instalación

### Prerrequisitos

- Node.js (v16 o superior)
- npm o yarn

### Pasos de instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/whinstondj/cypressSmartQA.git
   cd cypressSmartQA
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

## 🧪 Ejecución de Pruebas

### Modo Interactivo (Recomendado para desarrollo)
```bash
npx cypress open
```

### Modo Headless (Para CI/CD)
```bash
npx cypress run
```

### Ejecutar un test específico
```bash
npx cypress run --spec "cypress/e2e/comment_happy_path.cy.js"
```

## 📖 Tests Disponibles

### TC-BLOG-001: Happy Path - Comentario Pendiente
**Archivo:** `cypress/e2e/comment_happy_path.cy.js`

**Descripción:** Valida el flujo completo de creación de comentarios en el blog, verificando que queden en estado "pendiente de moderación".

**Pasos del test:**
1. Navega al blog principal
2. Cierra modales si están presentes
3. Abre el primer post disponible
4. Navega al formulario de comentarios
5. Llena todos los campos del formulario
6. Envía el comentario
7. Verifica mensaje de moderación

## 🔧 Configuración

### Configuración Principal
El archivo `cypress.config.js` contiene la configuración base del proyecto.

### Variables de Entorno
Puedes configurar variables de entorno en `cypress.env.json`:

```json
{
  "baseUrl": "https://blog.winstoncastillo.com",
  "timeout": 60000
}
```

## 🎯 Page Object Model

### BlogActions Class

La clase `BlogActions` encapsula todas las interacciones con el blog:

```javascript
const actions = new BlogActions();

// Métodos disponibles:
actions.visitHome()                    // Navegar al inicio
actions.openFirstPost()               // Abrir primer post
actions.scrollToCommentForm()         // Ir al formulario
actions.fillCommentForm(data)         // Llenar formulario
actions.submitComment()               // Enviar comentario
actions.assertAwaitingModeration()    // Verificar moderación
actions.debugPageStructure()          // Debugging
```

## 🐛 Debugging

Para activar el modo debugging, descomenta esta línea en tu test:

```javascript
actions.debugPageStructure();
```

Esto proporcionará información detallada sobre la estructura de la página en la consola de Cypress.

## 🔍 Características Avanzadas

### Selectores Resilientes
Los selectores están diseñados con múltiples fallbacks para manejar diferentes estructuras de WordPress:

- **Posts:** Detecta automáticamente títulos, encabezados y enlaces
- **Formularios:** Busca campos por nombre, ID, tipo y placeholders
- **Botones:** Identifica botones de envío por múltiples atributos

### Manejo de Modales
Cierre automático de modales comunes (Mailchimp, newsletters, etc.) con múltiples estrategias de detección.

### Logging Inteligente
Cada acción incluye logs contextuales para facilitar la depuración y el monitoreo.

## 🚦 CI/CD

### GitHub Actions (Recomendado)
```yaml
name: Cypress Tests
on: [push, pull_request]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: cypress-io/github-action@v5
        with:
          build: npm ci
          start: npm start
```

## 📊 Reportes

Para generar reportes HTML después de ejecutar las pruebas:

```bash
npx cypress run --reporter mochawesome
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convenciones de Código

- Usar Page Object Model para nuevas páginas
- Incluir logging descriptivo en todas las acciones
- Implementar selectores con fallbacks
- Escribir tests descriptivos y mantenibles

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Winston Castillo**
- GitHub: [@whinstondj](https://github.com/whinstondj)
- Blog: [blog.winstoncastillo.com](https://blog.winstoncastillo.com)

## 🙏 Agradecimientos

- [Cypress.io](https://cypress.io) - Framework de testing E2E
- Comunidad de QA automation por las mejores prácticas

---

⭐ Si este proyecto te ayuda, ¡considera darle una estrella en GitHub!