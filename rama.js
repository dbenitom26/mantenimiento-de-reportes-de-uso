git checkout main
git pull origin main
git checkout -b mantenimiento_de_informes_de_uso
git branch
git add .
git commit -m "Descripción de los cambios"
git push origin mantenimiento_de_informes_de_uso
from django.db import models
from django.contrib.auth.models import User

class ReporteUso(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    tiempo_uso = models.DurationField()  # Duración del uso
    intervalo_configurado = models.DurationField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Reporte de {self.usuario} - {self.fecha_creacion}"
const mongoose = require('mongoose');

const reporteUsoSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tiempo_uso: { type: Number, required: true },  // Tiempo de uso en milisegundos
    intervalo_configurado: { type: Number, required: true },  // Intervalo en milisegundos
    fecha_creacion: { type: Date, default: Date.now },
    descripcion: { type: String }
});

module.exports = mongoose.model('ReporteUso', reporteUsoSchema);
from django.shortcuts import render, get_object_or_404, redirect
from .models import ReporteUso
from .forms import ReporteUsoForm  # Asegúrate de tener un formulario

# Crear un reporte
def crear_reporte(request):
    if request.method == 'POST':
        form = ReporteUsoForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('lista_reportes')
    else:
        form = ReporteUsoForm()
    return render(request, 'crear_reporte.html', {'form': form})

# Listar reportes
def lista_reportes(request):
    reportes = ReporteUso.objects.all()
    return render(request, 'lista_reportes.html', {'reportes': reportes})

# Editar un reporte
def editar_reporte(request, reporte_id):
    reporte = get_object_or_404(ReporteUso, id=reporte_id)
    if request.method == 'POST':
        form = ReporteUsoForm(request.POST, instance=reporte)
        if form.is_valid():
            form.save()
            return redirect('lista_reportes')
    else:
        form = ReporteUsoForm(instance=reporte)
    return render(request, 'editar_reporte.html', {'form': form})

# Eliminar un reporte
def eliminar_reporte(request, reporte_id):
    reporte = get_object_or_404(ReporteUso, id=reporte_id)
    reporte.delete()
    return redirect('lista_reportes')
const express = require('express');
const router = express.Router();
const ReporteUso = require('../models/ReporteUso');

// Crear reporte
router.post('/reportes', async (req, res) => {
    try {
        const nuevoReporte = new ReporteUso(req.body);
        await nuevoReporte.save();
        res.status(201).send(nuevoReporte);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Listar reportes
router.get('/reportes', async (req, res) => {
    try {
        const reportes = await ReporteUso.find();
        res.send(reportes);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Editar reporte
router.put('/reportes/:id', async (req, res) => {
    try {
        const reporte = await ReporteUso.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!reporte) {
            return res.status(404).send();
        }
        res.send(reporte);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Eliminar reporte
router.delete('/reportes/:id', async (req, res) => {
    try {
        const reporte = await ReporteUso.findByIdAndDelete(req.params.id);
        if (!reporte) {
            return res.status(404).send();
        }
        res.send(reporte);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
