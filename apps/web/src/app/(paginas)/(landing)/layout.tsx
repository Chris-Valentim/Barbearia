'use client'
import Page from '@/components/shared/Page'

const Layout = (props: any) => {
  return (
    <Page>
      {props.children}
    </Page>
  )
}

export default Layout