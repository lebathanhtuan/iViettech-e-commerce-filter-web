import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 24px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
`

export const Logo = styled(Link)`
  font-size: 22px;
  font-weight: bold;
  color: #1677ff;
  text-decoration: none;
`

export const Content = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`

export const Footer = styled.footer`
  padding: 16px;
  text-align: center;
  background-color: #fff;
  border-top: 1px solid #f0f0f0;
  color: #888;
`
