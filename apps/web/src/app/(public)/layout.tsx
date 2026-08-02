'use client'
import Page from '@/components/layout/Page'

const Layout = (props: any) => {
  return (
    <Page>
      {props.children}
    </Page>
  )
}

export default Layout