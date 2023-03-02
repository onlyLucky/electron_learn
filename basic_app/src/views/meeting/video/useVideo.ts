/*
 * @Author: fg
 * @Date: 2023-02-28 15:40:04
 * @LastEditors: fg
 * @LastEditTime: 2023-02-28 17:40:37
 * @Description: content
 */
import { ref, isRef, unref, watchEffect } from 'vue'

export function useFetch(url: any) {
  const data = ref(null)
  const error = ref(null)

  async function doFetch() {
    // reset state before fetching..
    data.value = null
    error.value = null

    // resolve the url value synchronously so it's tracked as a
    // dependency by watchEffect()
    const urlValue = unref(url)

    try {
      // artificial delay / random error
      await timeout()
      // unref() will return the ref value if it's a ref
      // otherwise the value will be returned as-is
      const res = await fetch(urlValue)
      data.value = await res.json()
    } catch (e: any) {
      error.value = e
    }
  }

  if (isRef(url)) {
    // setup reactive re-fetch if input URL is a ref
    watchEffect(doFetch)
  } else {
    // otherwise, just fetch once
    doFetch()
  }

  return { data, error, retry: doFetch }
}

// artificial delay
function timeout() {
  return new Promise((resolve: Function, reject: Function) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        resolve()
      } else {
        reject(new Error('Random Error'))
      }
    }, 300)
  })
}