# BlackJack-EPN
Este proyecto ofrece una herramienta interactiva que te sugiere la mejor estrategia en Blackjack según tu mano y la carta visible del crupier. Además, incluye recomendaciones de apuestas basadas en el conteo de cartas.

>[!NOTE]
Usar un Entorno Virtual: Este "espacio de trabajo aislado" para un proyecto sirve para mantener limpias las dependencias de su sistema, evitar conflictos entre versiones de librerías y permitir tener diferentes configuraciones para cada proyecto

# Configuración Inicial

1. Crear y activar el entorno virtual (Solo 1 vez se hace esto)
   ```
    python -m venv .venv
   ```

2. Activar el entorno (hacerlo CADA VEZ que trabajes en el proyecto. Tomar en cuenta que depende de la terminal que se use, el comando será diferente).

- CMD
    ```
    .venv\Scripts\activate.bat
    ```

- PowerShell
    ```
    .venv\Scripts\Activate.ps1
    ```

- Git Bash
    ```
    source .venv/Scripts/activate
    ```

- WSL/Linux
    ```
    source .venv/bin/activate
    ```

3. Instalar dependencias
   ```
    pip install fastapi uvicorn ultralytics opencv-python numpy python-multipart
   ```

>[!IMPORTANT]
Uso de GPU
4. Si se quiere usar CUDA

  - Desinstalar todo lo relacionado a Pytorch y ultralytics
     ```
     pip uninstall torch torchvision torchaudio ultralytics -y
     ```
  
  - Instalar una versión específica de Pytorch con CUDA
    ```
    pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
    ```
  
  - Volver a instalar ultralytics
    ```
    pip install ultralytics
    ```

# Ejecutar la Aplicación
```
uvicorn API.myapi:app --reload
```

# Acceder a la API
Una vez ejecutado:
1. Visitar la interfaz de documentación: http://127.0.0.1:8000/docs
2. Usar el endpoint /detect para subir imágenes de cartas
