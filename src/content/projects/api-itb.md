---
title: "API Sistema contable ITB"
description: "La API utilizada por el sistema contable del Instituto Tecnológico Bolivariano de Tecnología (ITB) se encarga de realizar las importaciones de caja desde los sistemas SGA ITB, SGA ITB Online, Conduce Ecuador y Educación Continua ITB.
Esta API gestiona la información correspondiente a los pagos, notas de crédito y recibos de caja generados por los cajeros durante las sesiones de caja abiertas en el día seleccionado."
technologies: ["Python", "Django", "PyCharm"]
images:
  - "./static/api1.png"
previewLink: "https://sga.itb.edu.ec/api?a=facturacionNewProcess&fecha=06-09-2024&caja=164"
githubLink: ""
---

```python
def exportacion_datos_facturacion_newProcess(cajaid, fecha):
    try:
        # print('NUEVO PROCESO')
        response = []
        caja = LugarRecaudacion.objects.get(pk=cajaid)
        sesiones = caja.sesion_fecha(fecha)
        if sesiones:
            for sesion in sesiones:
                # print(sesion.id)
                data = {}
                pagos = []
                total = 0

                for f in FormaDePago.objects.all():
                    listPagos = Pago.objects.filter(sesion=sesion).values_list('id', flat=True)
                    mapaPagos = {
                        FORMA_PAGO_DEPOSITO: {'id__in': PagoTransferenciaDeposito.objects.filter(deposito=True, pagos__id__in=listPagos).values('pagos')},
                        FORMA_PAGO_TRANSFERENCIA: {'id__in': PagoTransferenciaDeposito.objects.filter(pagos__id__in=listPagos).exclude(deposito=True).values('pagos')},
                        FORMA_PAGO_CHEQUE: {'id__in': (PagoCheque.objects.filter(pagos__id__in=listPagos).annotate(pago_fecha=F('pagos__fecha')).filter(fechacobro=F('pago_fecha'))).values('pagos')},
                        FORMA_PAGO_CHEQUE_POSTFECHADO: {'id__in': (PagoCheque.objects.filter(pagos__id__in=listPagos).annotate(pago_fecha=F('pagos__fecha')).filter(~Q(fechacobro=F('pago_fecha')))).values('pagos')},
                        FORMA_PAGO_TARJETA_DEB: {'id__in': PagoTarjeta.objects.filter(tarjetadebito=True, pagos__id__in=listPagos).values('pagos')},
                        FORMA_PAGO_TARJETA: {'id__in': PagoTarjeta.objects.filter(pagos__id__in=listPagos).exclude(tarjetadebito=True).values('pagos')},
                        FORMA_PAGO_RETENCION: {'id__in': PagoRetencion.objects.filter(pagos__id__in=listPagos).values('pagos')},
                        FORMA_PAGO_NOTA_CREDITO: {'id__in': PagoNotaCreditoInstitucion.objects.filter(pagos__id__in=listPagos).values('pagos')},
                        FORMA_PAGO_RECIBOCAJAINSTITUCION: {'id__in': PagoReciboCajaInstitucion.objects.filter(pagos__id__in=listPagos).values('pagos')},
                        FORMA_PAGO_EFECTIVO: {'efectivo': True},
                        FORMA_PAGO_WESTER: {'wester': True},
                        FORMA_PAGO_PACIFICO: {'pacifico': True},
                        FORMA_PAGO_REFERIDO: {'referido': True},
                        FORMA_PAGO_PICHINCHA: {'pichincha': True},
                        FORMA_PAGO_PAGOONLINE: {'paymentez': True},
                        FORMA_PAGO_FACILITO: {'facilito': True},
                        FORMA_PAGO_ELECTRONICO: {'electronico': True}
                    }
                    filtro = mapaPagos[f.id]
                    pagosFP = Pago.objects.filter(sesion=sesion).filter(**filtro)
                    print(f.nombre+": " + str(pagosFP.aggregate(Sum('valor'))['valor__sum']))
                    for p in pagosFP:
                        total += p.valor
                        datosPago = {}
                        factura = p.factura_set.filter()[:1].get()

                        descPromo=0
                        descBeca=0
                        if DetalleDescuento.objects.filter(pago=p).exists():
                            descPromo = DetalleDescuento.objects.filter(pago=p).aggregate(Sum('valor'))['valor__sum']
                        if DetalleRubrosBeca.objects.filter(pago=p).exists():
                            descBeca = DetalleRubrosBeca.objects.filter(pago=p).aggregate(Sum('descuento'))['descuento__sum']

                        datosPago['facturaNumero'] = factura.numero
                        datosPago['inscripcionNombre'] = p.rubro.inscripcion.persona.nombre_completo()
                        datosPago['clienteRuc'] = factura.cliente.ruc
                        datosPago['clienteTelefono'] = factura.cliente.telefono
                        datosPago['clienteDireccion'] = elimina_tildes(factura.cliente.direccion)
                        datosPago['carreraId'] = p.rubro.inscripcion.carrera.id
                        datosPago['carreraNombre'] = elimina_tildes(p.rubro.inscripcion.carrera.nombre)
                        datosPago['formaPagoId'] = f.id
                        datosPago['formaPagoNombre'] = elimina_tildes(f.nombre)
                        datosPago['formaPagoCodigo'] = f.codigoformapago.codigo
                        datosPago['pagoValor'] = p.valor
                        datosPago['rubroNombre'] = elimina_tildes(p.rubro.nombre())
                        datosPago['descPromo'] = descPromo
                        datosPago['descBeca'] = descBeca
                        datosPago['esFraude'] = False
                        if p.rubro.nc:
                            if NotaCreditoInstitucion.objects.get(pk=p.rubro.nc).motivonc:
                                datosPago['esFraude'] = True if NotaCreditoInstitucion.objects.get(pk=p.rubro.nc).motivonc.id == 1 else False

                        tipoRubro = p.rubro.obtener_tipo_rubro()
                        datosPago['tipoRubroId'] = tipoRubro.id
                        datosPago['tipoRubroDescripcion'] = tipoRubro.nombre
                        # print(datosPago)

                        pagos.append(datosPago)
                data['PAGOS'] = pagos

                notasDeCredito = []
                for nc in NotaCreditoInstitucion.objects.filter(sesioncaja=sesion):
                    datosNC = {}
                    datosNC['ncId'] = nc.id
                    datosNC['ncValor'] = nc.valor
                    datosNC['ncFecha'] = str(nc.fecha)
                    datosNC['ncTipoId'] = nc.tipo.id
                    datosNC['ncTipoDescripcion'] = elimina_tildes(nc.tipo.descripcion)
                    datosNC['inscripcionCedula'] = nc.inscripcion.persona.cedula
                    datosNC['inscripcionNombre'] = nc.inscripcion.persona.nombre_completo()
                    datosNC['carreraId'] = nc.inscripcion.carrera.id
                    datosNC['carreraNombre'] = elimina_tildes(nc.inscripcion.carrera.nombre)
                    datosNC['facturaId'] = nc.factura.id
                    datosNC['facturaNumero'] = nc.factura.numero
                    datosNC['facturaFecha'] = str(nc.factura.fecha)
                    datosNC['esFraude'] = False
                    if nc.motivonc:
                        datosNC['esFraude'] = True if nc.motivonc.id == 1 else False

                    notasDeCredito.append(datosNC)
                data['NC'] = notasDeCredito

                recibosDeCaja = []
                for rc in ReciboCajaInstitucion.objects.filter(sesioncaja=sesion).exclude(activo=False):
                    if not rc.formapago:
                        try:
                            rc.formapago = Pago.objects.filter(sesion=rc.sesioncaja, rubro__inscripcion=rc.inscripcion).order_by('-id')[:1].get().obtener_forma_pago()
                            rc.save()
                        except Exception as ex:
                            print("ERROR AL GENERAR FORMA DE PAGO EN RC: "+str(ex))
                    datosRC = {}
                    datosRC['rcId'] = rc.id
                    datosRC['rcValorInicial'] = rc.valorinicial
                    datosRC['rcFecha'] = str(rc.fecha)
                    datosRC['inscripcionCedula'] = rc.inscripcion.persona.cedula
                    datosRC['inscripcionNombre'] = rc.inscripcion.persona.nombre_completo()
                    datosRC['carreraId'] = rc.inscripcion.carrera.id
                    datosRC['carreraNombre'] = elimina_tildes(rc.inscripcion.carrera.nombre)
                    datosRC['formaPagoId'] = rc.formapago.id if rc.formapago else ''
                    datosRC['formaPagoCodigo'] = rc.formapago.codigoformapago.codigo if rc.formapago else ''
                    recibosDeCaja.append(datosRC)
                data['RC'] = recibosDeCaja
                response.append(data)
        print(response)
        return response

    except Exception as ex:
        print(ex)
        return {'ERROR': str(ex)}

  ```