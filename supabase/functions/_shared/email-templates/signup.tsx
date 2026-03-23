/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName = 'Nutroo',
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Confirme seu cadastro na Nutroo 🍎</Preview>
    <Body style={main}>
      <Container style={container}>
        <div style={logoSection}>
          <Text style={logoText}>🍎 Nutroo</Text>
        </div>
        <Heading style={h1}>Falta só um passo!</Heading>
        <Text style={text}>
          Olá! Estamos muito felizes em ter você na <strong>Nutroo</strong>.
          Para concluir seu cadastro e acessar o app, confirme seu email clicando no botão abaixo:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirmar meu email
        </Button>
        <Text style={textSmall}>
          Se o botão não funcionar, copie e cole este link no navegador:
        </Text>
        <Text style={linkFallback}>
          {confirmationUrl}
        </Text>
        <Text style={footer}>
          Se você não criou uma conta na Nutroo, ignore este email com segurança.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Nunito', Arial, sans-serif" }
const container = { padding: '30px 25px', maxWidth: '480px', margin: '0 auto' }
const logoSection = { textAlign: 'center' as const, marginBottom: '24px' }
const logoText = { fontSize: '28px', fontWeight: 'bold' as const, color: '#3B5366', margin: '0' }
const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#3B5366',
  margin: '0 0 16px',
  textAlign: 'center' as const,
}
const text = {
  fontSize: '15px',
  color: '#6B6358',
  lineHeight: '1.6',
  margin: '0 0 24px',
}
const textSmall = {
  fontSize: '12px',
  color: '#999999',
  margin: '24px 0 4px',
}
const linkFallback = {
  fontSize: '11px',
  color: '#999999',
  wordBreak: 'break-all' as const,
  margin: '0 0 24px',
}
const button = {
  backgroundColor: '#E8B84B',
  color: '#3B5366',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  borderRadius: '16px',
  padding: '14px 32px',
  textDecoration: 'none',
  display: 'block',
  textAlign: 'center' as const,
  width: '100%',
  boxSizing: 'border-box' as const,
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0', textAlign: 'center' as const }
