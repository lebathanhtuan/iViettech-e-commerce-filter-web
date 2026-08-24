import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
`

export const Sidebar = styled.aside`
  width: 220px;
  flex-shrink: 0;
  background-color: #001529;
`

export const Logo = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`

export const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
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

export const Content = styled.main`
  flex: 1;
  padding: 24px;
`
