/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName = 'Nutroo',
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Redefinir sua senha na Nutroo</Preview>
    <Body style={main}>
      <Container style={container}>
        <div style={logoSection}>
          <Text style={logoText}>🍎 Nutroo</Text>
        </div>
        <Heading style={h1}>Redefinir senha</Heading>
        <Text style={text}>
          Recebemos uma solicitação para redefinir sua senha na <strong>Nutroo</strong>.
          Clique no botão abaixo para criar uma nova senha:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Redefinir minha senha
        </Button>
        <Text style={footer}>
          Se você não solicitou a redefinição de senha, ignore este email. Sua senha não será alterada.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

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
