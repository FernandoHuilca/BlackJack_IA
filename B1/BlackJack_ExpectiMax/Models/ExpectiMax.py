from collections import Counter

class Expectimax:
    def calcularProbabilidades(self, cartasRestantes):
        if not cartasRestantes:
            return {}
        
        contador = Counter(cartasRestantes)
        totalCartas = len(cartasRestantes)
        
        probabilidades = {}
        for valor, cantidad in contador.items():
            probabilidades[valor] = cantidad / totalCartas
        
        #print(f"Probabilidades calculadas: {probabilidades}")  # Debugging output
        return probabilidades # Retorna un diccionario {valorCarta: probabilidad}
    
    def aplicarExpectimax(self, nodo):
    
        if nodo.tipoDeNodo == "TERMINAL":
            return nodo.valor
        
        elif nodo.tipoDeNodo == "MAX":
            # Nodo MAX: el jugador elige la mejor acción
            valorMaximo = float('-inf')
            
            for hijo in nodo.hijos:
                valorHijo = self.aplicarExpectimax(hijo)
                valorMaximo = max(valorMaximo, valorHijo)

            nodo.valor = valorMaximo
            return valorMaximo
        
        elif nodo.tipoDeNodo == "EXPSTAND" or nodo.tipoDeNodo == "EXPHIT":
            # Nodo EXP: calcular valor esperado con probabilidades reales
            valorEsperado = 0.0
            
            # MÉTODO 1: Si los hijos representan diferentes cartas posibles
            probabilidades = self.calcularProbabilidades(nodo.barajaNodo)
            
            for hijo in nodo.hijos:
                # Determinar qué carta llevó a este hijo
                cartaRecibida = self.determinarCartaRecibida(nodo, hijo)
                #print(f"Carta recibida: {cartaRecibida}")  # Debugging output

                if cartaRecibida in probabilidades:
                    probCarta = probabilidades[cartaRecibida]
                    #print(f"Probabilidad de {cartaRecibida}: {probCarta}")  # Debugging output
                    valorHijo = self.aplicarExpectimax(hijo)
                    valorEsperado += probCarta * valorHijo
                    #print(f"Valor esperado parcial: {valorEsperado}")  # Debugging output

            nodo.valor = valorEsperado
            #print(f"Valor esperado del nodo EXP: {valorEsperado}")
            return valorEsperado

    def determinarCartaRecibida(self, nodoPadre, nodoHijo): #Determina qué carta causó la transición del nodo padre al hijo.

        # Comparar las cartas del jugador o dealer para ver cuál se añadió
        if len(nodoHijo.cartasJugador) > len(nodoPadre.cartasJugador):
            # El jugador recibió una carta
            return nodoHijo.cartasJugador[-1]  # Última carta añadida
        elif len(nodoHijo.cartasDealer) > len(nodoPadre.cartasDealer):
            # El dealer recibió una carta
            return nodoHijo.cartasDealer[-1]  # Última carta añadida
        else:
            # No debería pasar si el árbol está bien construido
            return None
        