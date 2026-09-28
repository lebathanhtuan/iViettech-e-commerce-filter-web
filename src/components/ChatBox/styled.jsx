import styled from 'styled-components'

export const Panel = styled.div`
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: 360px;
  max-width: calc(100vw - 32px);
  height: 480px;
  max-height: calc(100vh - 48px);
  overflow: hidden;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  font-weight: bold;
  color: #fff;
  background-color: #1677ff;

  button {
    color: #fff !important;
  }
`

export const Body = styled.div`
  flex: 1;
  min-height: 0;
`
