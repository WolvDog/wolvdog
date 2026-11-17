/**
 * Chaves PÚBLICAS do SDK do RevenueCat (projeto WolvDog). Podem ficar no código: só leem ofertas e registram compras.
 * A chave secreta do RevenueCat nunca entra no app.
 * - android: app "WolvDog (Play Store)", package com.wolvdog.app
 * - ios: sai quando a conta da Apple for ativada e o app da App Store for criado no RevenueCat (vazia = compras simuladas no iPhone)
 */
export const REVENUECAT_API_KEYS = {
  android: 'goog_BVBTlMahxyIgLDyNvYSkkYVHtUk',
  ios: '',
};

/**
 * Compras simuladas (o botão de assinar libera o Pro sem cobrança), para testadores antes das lojas.
 * Ligado por EXPO_PUBLIC_PURCHASES_MOCK=1: no perfil "preview" do eas.json (APK de teste) e no .env local (versão web).
 * Antes do lançamento: remover dos dois lugares.
 */
export const PURCHASES_MOCK = process.env.EXPO_PUBLIC_PURCHASES_MOCK === '1';
