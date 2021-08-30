import { reactive } from 'vue'
import { generalStore } from '@/store/generalStore'

import useSupabase from '@/hooks/useSupabase'

const supabase = useSupabase()

export const store = {
  /**
   * Default State
   */
  state: reactive({
    links: [],
    collections: [],
    joinNotesCollections: [],
    joinNotesLinks: [],
  }),


  /**
   * Collections
   */
  async collectionsFetch() {
    const { data, error } = await supabase
      .from('collections')
      .select('*')

    if (error) 
      console.error(error)

    this.state.collections = data
  },

  collectionFindById({ collectionId }) {
    return this.state.collections.find(collection => collection.id === collectionId)
  },


  /**
   * Join Notes Collections
   */
  async joinNotesCollectionsFetch() {
    const { data, error } = await supabase
      .from('join_notes_collections')
      .select('*')

    if (error)
      console.error(error)

    this.state.joinNotesCollections = data
  },


  /**
   * Join Notes Links
   */
  async joinNotesLinksFetch() {
    const { data, error } = await supabase
      .from('join_notes_links')
      .select('*')

    if (error)
      console.error(error)

    this.state.joinNotesLinks = data
  },

  async joinNotesLinksInsert({ newVals }) {
    await this.joinNotesLinksFetch()

    // Filter out duplicates
    newVals = newVals.filter(newVal => !this.state.joinNotesLinks.find(join => join.note_id === newVal.note_id && join.link_id === newVal.link_id))

    const { data, error } = await supabase
      .from('join_notes_links')
      .insert(newVals.map(newVal => ({
        ...newVal,
        owner_id: generalStore.state.user.id
      })))

    if (error)
      console.error(error)

    this.state.joinNotesLinks.push(...data)
  },

  async joinNotesLinksDelete({ urlArray, noteId }) {
    // Get all link.id's for this note
    const linkIds = urlArray.map(url => (this.state.links.find(link => link.url === url)).id)

    // Delete all joins for this note
    const { error } = await supabase
      .from('join_notes_links')
      .delete()
      .eq('note_id', noteId)
      .in('link_id', linkIds)
    if (error) console.error(error)

    // Remove deleted joins from state
    this.state.joinNotesLinks = this.state.joinNotesLinks.filter(join => !linkIds.includes(join.link_id))
  },


  /**
   * Links
   */
  _findLinksByNoteId({ noteId }) {
    const joins = this.state.joinNotesLinks.filter(join => join.note_id === noteId)
    return joins.map(join => {
      return this.state.links.find(link => link.id === join.link_id)
    })
  },

  async linksFetch() {
    const { data, error } = await supabase
      .from('links')
      .select('*')

    if (error)
      console.error(error)

    this.state.links = data
  },

  async linksInsert({ urlArray = [], noteId = null }) {
    // Update existing links
    await this.linksFetch()

    // Prepare new links
    const preparedData = [],
          preparedJoins = []
    for (const newVal of urlArray) {
      const existingLink = this.state.links.find(link => link.url === newVal)
      if (existingLink) {
        preparedJoins.push({ note_id: noteId, link_id: existingLink.id })
        continue
      }
      
      // Fetch metadata
      let metadata
      try {
        const metadataAPIUrl = 'https://netlify-functions-madebyfabian.netlify.app/.netlify/functions/meta-fetcher?url=' + newVal
        const metadataRes = await fetch(metadataAPIUrl)
        const json = await metadataRes.json()
        metadata = json?.metadata

      } catch (error) {
        console.error(error)
      }

      preparedData.push({
        url: newVal,
        title: metadata?.title || null,
        banner_url: metadata?.banner || null,
        owner_id: generalStore.state.user.id
      })
    }

    // If there are new links to insert into the DB, do this first.
    if (preparedData.length !== 0) {
      // Insert into database
      const { data, error } = await supabase
        .from('links')
        .insert(preparedData)
      if (error) console.error(error)

      // Update local state
      this.state.links.push(...data)

      // Update joins
      preparedJoins.push(...data.map(link => ({ note_id: noteId, link_id: link.id })))
    }

    // Then, if there are some new joins to insert, do this.
    if (preparedJoins.length !== 0) {
      this.joinNotesLinksInsert({ newVals: preparedJoins })
    }
  },

  async linksDelete({ urlArray, noteId }) {
    await this.joinNotesLinksDelete({ urlArray, noteId })

    // Delete all joins for this note
    const { error } = await supabase
      .from('links')
      .delete()
      .in('url', urlArray)
    if (error) console.error(error)

    // Remove deleted links from state
    this.state.links = this.state.links.filter(link => !urlArray.includes(link.url))
  },
}