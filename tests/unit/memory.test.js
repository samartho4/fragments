const {
    writeFragment,
    readFragment,
    writeFragmentData,
    readFragmentData,
    listFragments,
    deleteFragment,
  } = require('../../src/model/data/memory');
  
  describe('In-Memory Database Tests', () => {
    const ownerId = 'user1';
    const fragmentId = 'fragment1';
    const fragment = { ownerId, id: fragmentId, type: 'text/plain', size: 10 };
    const buffer = Buffer.from('Hello, World!');
  
    test('writeFragment and readFragment', async () => {
      // Write a fragment
      await writeFragment(fragment);
  
      // Read the fragment
      const result = await readFragment(ownerId, fragmentId);
  
      // Verify the fragment matches what was written
      expect(result).toEqual(fragment);
    });
  
    test('writeFragmentData and readFragmentData', async () => {
      // Write fragment data
      await writeFragmentData(ownerId, fragmentId, buffer);
  
      // Read fragment data
      const result = await readFragmentData(ownerId, fragmentId);
  
      // Verify the data matches what was written
      expect(result).toEqual(buffer);
    });
  
    test('listFragments without expansion', async () => {
      // Write a fragment
      await writeFragment(fragment);
  
      // List fragments without expansion
      const result = await listFragments(ownerId);
  
      // Verify the list contains the fragment ID
      expect(result).toEqual([fragmentId]);
    });
  
    test('listFragments with expansion', async () => {
      // Write a fragment
      await writeFragment(fragment);
  
      // List fragments with expansion
      const result = await listFragments(ownerId, true);
  
      // Verify the list contains the full fragment object
      expect(result).toEqual([fragment]);
    });
  
    test('deleteFragment', async () => {
      // Write a fragment and its data
      await writeFragment(fragment);
      await writeFragmentData(ownerId, fragmentId, buffer);
  
      // Delete the fragment
      await deleteFragment(ownerId, fragmentId);
  
      // Verify the fragment and its data are deleted
      const metadataResult = await readFragment(ownerId, fragmentId);
      const dataResult = await readFragmentData(ownerId, fragmentId);
  
      // Expect both to be undefined after deletion
      expect(metadataResult).toBeUndefined();
      expect(dataResult).toBeUndefined();
    });
  
    test('readFragment returns undefined for non-existent fragment', async () => {
      const result = await readFragment(ownerId, 'non-existent-id');
      expect(result).toBeUndefined();
    });
  
    test('readFragmentData returns undefined for non-existent fragment', async () => {
      const result = await readFragmentData(ownerId, 'non-existent-id');
      expect(result).toBeUndefined();
    });
  });