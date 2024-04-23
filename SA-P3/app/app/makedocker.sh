#!/bin/bash

# Construir la imagen Docker
docker build -t grifiun/sa:latest_practica4 .

# Verificar si la construcción fue exitosa
if [ $? -eq 0 ]; then
    echo "La construcción de la imagen fue exitosa."
else
    echo "Error: La construcción de la imagen falló."
    exit 1
fi

# Hacer push de la imagen a Docker Hub
docker push grifiun/sa:latest_practica4

# Verificar si el push fue exitoso
if [ $? -eq 0 ]; then
    echo "La imagen se ha enviado correctamente a Docker Hub."
else
    echo "Error: Falló el push de la imagen a Docker Hub."
    exit 1
fi

echo "Proceso completado."
